
'use strict'
var fs = require("fs");
var App2topicMap = new Map();
var App2RpcMap = new Map();
/************************************************************************
* The LocalDatabaseManager manages the whole connectivity between any WAMP Nodes in Node-Red
* and the local file system.
* It caches informations about app interfaces in form of RPC's and puplished topics (https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) 
* @class cWunderbar
* @constructor
*************************************************************************/
class cLocalDatabaseManager {

  constructor() {
      //open file
      console.log("cLocalDatabaseManager constructed in ");
  }
  getApps(callback) {
    var files = fs.readdirSync("/home/pi/node_modules/node-red/appstore/");
    var i = 0;
    var _JSONapps = [];
    for(var name of files) {
        var appfile = fs.readFileSync("/home/pi/node_modules/node-red/appstore/" + name);
        var jsonfile = JSON.parse(appfile);
        _JSONapps.push({
                index: i,
                name: jsonfile.name,
                base: jsonfile.wamp.base
                });
        App2topicMap.set(jsonfile.name, jsonfile.wamp.topics);
        App2RpcMap.set(jsonfile.name, jsonfile.wamp.RPC);
        i += 1;
    }
    callback("ok", _JSONapps);
  }
  
  getTopicsForApp(appName) {
      var loc_topics = App2topicMap.get(appName);
      var ret = [];
      for(var topic of loc_topics) {
          ret.push({name: topic})
      }
      return ret;
  }
  
  getProceduresForApp(appName) {
      return App2RpcMap.get(appName);
  }
  
  getProcedureParameter(appname, procedurename, scope) {
      return App2topicMap.get(appname)[0];
  }
}

exports.LocalDatabasemanager = cLocalDatabaseManager;
