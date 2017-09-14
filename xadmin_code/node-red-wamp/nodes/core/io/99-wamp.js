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
 //blub
  //var databaseManager = require('../DatabaseManager.js');
  var LocalDatabaseManager = require("../LocalDatabaseManager.js").LocalDatabasemanager;
  var databaseManager = new LocalDatabaseManager();
  var autobahnManager = require('../AutobahnManager.js');

  function WAMPInNode(n) {
    RED.nodes.createNode(this, n);
    this.app = n.app; //0
    this.topic = n.topic; //gyro1
    this.base = n.base;

    this.subscription = this.base + this.topic;

    var node = this;

    console.log('WAMPIN with subscription: ' + this.subscription);
    autobahnManager.subscribe(this.subscription, dataReceived);

    function dataReceived(result) {

      console.log('WAMPIN: ' + node.id + ' Received Data of a subscription: ' + result);

      var msg = {
        payload: result.value,
        topic: result.topic
      };
      //pass the msg object onto the next node
      node.send(msg);

    }

    // Show connetionStatus
    autobahnManager.on('com.AutobahnManager.status', wampConnectionStatus);

    function wampConnectionStatus(status) {

      if (status) {
        node.status({
          fill: "green",
          shape: "dot",
          text: "connected"
        })
      } else {
        node.status({
          fill: "red",
          shape: "ring",
          text: "disconnected"
        });
      }
    }

    node.on('close', function() {

      console.log('Removed node which is subscribed to: ' + this.subscription);
      autobahnManager.unsubscribe(this.subscription, dataReceived);
      autobahnManager.removeListener('com.AutobahnManager.status', wampConnectionStatus);

    });

  }
  RED.nodes.registerType("wamp in", WAMPInNode);

  function WAMPOutNode(n) {
    RED.nodes.createNode(this, n);
    this.topic = n.topic;

    var node = this;

    //this registers a listener on the input event - only gets used when executed
    node.on("input", function(msg) {

      console.log('WAMPOUT connected: Publish topic: ' + this.topic + ' with msg ' + JSON.stringify(msg));
       //bug from ibm data transferred as string
        //autobahnManager.publish(this.topic, [JSON.stringify(msg)]);
      autobahnManager.publish(this.topic, [msg]);
    });

  }
  RED.nodes.registerType("wamp out", WAMPOutNode);

  //
  // HTTP endpoints that will be accessed from the HTML file and return data to the HTML file
  //
  RED.httpAdmin.get('/apps', function(req, res) {

    databaseManager.getApps(function(status, result) {

      if (status === 'ok') {

        res.send(JSON.stringify(result))

      } else {
        console.log('Error in fetch Data: ' + result);
        res.send('Error in fetch data: ' + result);

      }

    });

  }); //end of .get

  RED.httpAdmin.get('/topics/:name', function(req, res) {
    var appName = req.params.name;
    if (appName.length < 0) {
      appName = ""
    };

    console.log("appName=" + appName);

    if (appName != "") {

      var JSONtopicsForUI = databaseManager.getTopicsForApp(appName);

      //return the values for the select drop-down options for TOPICS
      res.send(JSON.stringify(JSONtopicsForUI));
    }; //end of appName != null
  }); //end of .get

}
