/**
 * Copyright 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
  "use strict";

  var util = require("util");
  var vm = require("vm");

  //var databaseManager = require('../DatabaseManager.js');
  var LocalDatabaseManager = require("../LocalDatabaseManager.js").LocalDatabasemanager;
  var databaseManager = new LocalDatabaseManager();
  var autobahnManager = require('../AutobahnManager.js');

  function sendResults(node, _msgid, msgs) {
    if (msgs == null) {
      return;
    } else if (!util.isArray(msgs)) {
      msgs = [msgs];
    }
    var msgCount = 0;
    for (var m = 0; m < msgs.length; m++) {
      if (msgs[m]) {
        if (util.isArray(msgs[m])) {
          for (var n = 0; n < msgs[m].length; n++) {
            msgs[m][n]._msgid = _msgid;
            msgCount++;
          }
        } else {
          msgs[m]._msgid = _msgid;
          msgCount++;
        }
      }
    }
    if (msgCount > 0) {
      node.send(msgs);
    }
  }

  function WAMPrpcCallNode(n) {
    RED.nodes.createNode(this, n);
    this.app = n.app;
    this.procedure = n.procedure;
    this.func = n.func;
    this.base = n.base;

    var functionText = "var results = null;" +
      "results = (function(msg){ " +
      "var __msgid__ = msg._msgid;" +

      // Inject __callRPC__ Method into the javascript sandbox.
      // The this.procedure is the selected procedure and is calling the __callRPC__
      // which is call the Autobahn.Call function

      "var " + this.procedure +" = __callRPC__;" +
      "var node = {" +
      "log:__node__.log," +
      "error:__node__.error," +
      "warn:__node__.warn," +
      "on:__node__.on," +
      "send:function(msgs){ __node__.send(__msgid__,msgs);}" +
      "};\n" +
      this.func + "\n" +
      "})(msg);";

    var node = this;

    var sandbox = {
      console: console,
      util: util,
      Buffer: Buffer,
      __node__: {
        log: function() {
          node.log.apply(node, arguments);
        },
        error: function() {
          node.error.apply(node, arguments);
        },
        warn: function() {
          node.warn.apply(node, arguments);
        },
        send: function(id, msgs) {
          sendResults(node, id, msgs);
        },
        on: function() {
          node.on.apply(node, arguments);
        }
      },
      __callRPC__: function(parameters, callbackMethod) {

        var topic = node.base + node.procedure;

        autobahnManager.call(topic, parameters, function(result){
        console.log('RPC-Method Result: ' + JSON.stringify(result));
        callbackMethod(result);

        });

      },

      context: {
        global: RED.settings.functionGlobalContext || {}
      },
      setTimeout: setTimeout,
      clearTimeout: clearTimeout
    };

    var context = vm.createContext(sandbox);

    try {
      this.script = vm.createScript(functionText);
      this.on("input", function(msg) {
        try {
          var start = process.hrtime();
          context.msg = msg;
          this.script.runInContext(context);
          sendResults(this, msg._msgid, context.results);

          var duration = process.hrtime(start);
          var converted = Math.floor((duration[0] * 1e9 + duration[1]) / 10000) / 100;
          this.metric("duration", msg, converted);
          if (process.env.NODE_RED_FUNCTION_TIME) {
            this.status({
              fill: "yellow",
              shape: "dot",
              text: "" + converted
            });
          }
        } catch (err) {

          var line = 0;
          var errorMessage;
          var stack = err.stack.split(/\r?\n/);
          if (stack.length > 0) {
            while (line < stack.length && stack[line].indexOf("ReferenceError") !== 0) {
              line++;
            }

            if (line < stack.length) {
              errorMessage = stack[line];
              var m = /:(\d+):(\d+)$/.exec(stack[line + 1]);
              if (m) {
                var line = Number(m[1]) - 1;
                var cha = m[2];
                errorMessage += " (line " + line + ", col " + cha + ")";
              }
            }
          }
          if (!errorMessage) {
            errorMessage = err.toString();
          }
          this.error(errorMessage, msg);
        }
      });
    } catch (err) {
      // eg SyntaxError - which v8 doesn't include line number information
      // so we can't do better than this
      this.error(err);
    }

  }
  RED.nodes.registerType("wamp rpc call", WAMPrpcCallNode);

  //
  // HTTP endpoints that will be accessed from the HTML file and return data to the HTML file
  //
  RED.httpAdmin.get('/RPCApps', function(req, res) {

    databaseManager.getApps(function(status, result) {

      if (status === 'ok') {

        res.send(JSON.stringify(result))

      } else {
        console.log('Error in fetch Data: ' + result);
        res.send('Error in fetch data: ' + result);

      }

    });

  }); //end of .get

  RED.httpAdmin.get('/procedures/:name', function(req, res) {
    var appName = req.params.name;
    if (appName.length < 0) {
      appName = ""
    };

    console.log("appName=" + appName);

    if (appName != "") {

      var proceduresForApp = databaseManager.getProceduresForApp(appName);

      //return the values for the select drop-down options for TOPICS
      res.send(JSON.stringify(proceduresForApp));
    }; //end of appName != null
  }); //end of .get

  RED.httpAdmin.get('/parameters/:appName/:procedureName', function(req, res) {
    var appName = req.params.appName;
    var procedureName = req.params.procedureName;

    if (appName != "" && procedureName != "") {

      var parametersForProcedure = databaseManager.getProcedureParameter(appName, procedureName);

      //return the values for the select drop-down options for TOPICS
      res.send(JSON.stringify(parametersForProcedure));
    }; //end of appName != null
  }); //end of .get


}
