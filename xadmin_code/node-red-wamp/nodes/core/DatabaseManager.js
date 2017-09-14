var Cloudant = require('cloudant');


// The DatabaseManager manages the whole connectivity between any WAMP Nodes in Node-Red
// and the CloudantDB.
// It is also cache informations about apps and topics for 24h to reduce request to the database.

function DatabaseManager() {

  // Cloudant credentials
  this._cloudantURL = "xxx-bluemix";
  this._user = "xxx";
  this._password = "xxx";
  this._databaseName = "appstore";


  this._JSONapps = []; //array of JSON objects for apps
  this._JSONtopics = []; //array of JSON objects for topics
  this._JSONProcedures = []; // array of JSON objects for RPCs


  // Date Object shows last successful connection to the database
  this._lastDBAccess;

  // milliseconds for one day
  this._updateFrequency = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
}

// Check whether is needed to fetch data from DB (DB call all 24h)
DatabaseManager.prototype._refreshNeeded = function() {

  if (typeof this._lastDBAccess == 'undefined') return true;

  var now = new Date();
  var diffDays = Math.round(Math.abs((now.getTime() - this._lastDBAccess.getTime()) / (this._updateFrequency)));

  if (diffDays > 0) {

    return true;

  } else {

    return false;
  }

}

// callback is a callback method: function(status, result)
DatabaseManager.prototype.getApps = function(callback) {

  if (!this._refreshNeeded()) {
    callback('ok', this._JSONapps);
    return;
  }

  var credentials = {
    account: this._cloudantURL,
    key: this._user,
    password: this._password
  };

  var that = this;

  Cloudant(credentials, function(err, cloudant) {
    if (err) {

      callback('unreachable', err.description);
      //msg.payload = "error connecting to Cloudant";
      console.log("error:" + msg.payload);

    } else {
      var db = cloudant.use(that._databaseName);

      db.find({
          selector: {
            appType: 'native'
          }
        }, function(err, result) {

          if (!err) {
            console.log("Found %d documents of AppType=native", result.docs.length);

            // Clear existing apps and topics, otherwise apps and topics are shown multiple.
            that._JSONapps = [];
            that._JSONtopics = [];

            for (var i = 0; i < result.docs.length; i++) {
              console.log('  App name: %s', result.docs[i].name);
              console.log('    Topics: %s', result.docs[i].wamp.topics);
              console.log('      Base: %s', result.docs[i].wamp.base);

              that._JSONapps.push({
                index: i,
                name: result.docs[i].name,
                base: result.docs[i].wamp.base
              });
              console.log('  JSONapps: %s', that._JSONapps[i].index);
              that._JSONtopics.push({
                appName: result.docs[i].name,
                topics: result.docs[i].wamp.topics
              });
              console.log('  JSONtopics: %s', that._JSONtopics[i].appName);
              console.log('  JSONtopics: %s', that._JSONtopics[i].topics);

              that._JSONProcedures.push({

                appName: result.docs[i].name,
                rpc: result.docs[i].wamp.RPC


              });

            }
            //return the values for the select drop-down options for APPS
            //res.send(JSON.stringify(JSONapps));

            that._lastDBAccess = new Date();
            callback('ok', that._JSONapps);

          } else {
            console.log("There was an error fetching data from Cloudant");
            callback('missing', err.description);
            if (err.description === "missing") {
              console.log(
                "Document(s) not found in database '" + databaseName + "'.",
                err
              );
            } else {
              console.log(err.description, err);
            }
          }
        }) //end of db.find()
    } //end of if(err)
  }); //end of Cloudant()
}


DatabaseManager.prototype.getTopicsForApp = function(appName) {

  //this is where we need to get the list of Topics, split it up and return it to the UI
  //topics: temperature1,humidity1,gyro1,light1

  var fetchTopicsForUI = function(appname, scope) {
    var appIndx = 0;

    for (var j = 0; j < scope._JSONtopics.length; j++) {
      if (scope._JSONtopics[j].appName == appName) {
        appIndx = j;
        break;
      }
    }

    var databaseTopics = scope._JSONtopics[appIndx].topics;
    //create the output to build the topics select drop-down options
    var JSONtopicsForUI = [];
    var array = databaseTopics.toString().split(',');

    for (var i = 0; i < array.length; i++) {
      JSONtopicsForUI.push({
        name: array[i]
      });
    }
    return JSONtopicsForUI;

  }

  // In case a request is received and no data are cached,
  // fetch at first all available apps
  if (typeof this._lastDBAccess == 'undefined') {

    var that = this;

    this.getApps(function(status, result) {

      return fetchTopicsForUI(appName, that);

    });

  } else {

    return fetchTopicsForUI(appName, this);

  }

}


DatabaseManager.prototype.getProceduresForApp = function(appName) {

  //this is where we need to get the list of Topics, split it up and return it to the UI
  //topics: temperature1,humidity1,gyro1,light1

  var fetchProcedures = function(appname, scope) {
    var appIndx = 0;

    for (var j = 0; j < scope._JSONProcedures.length; j++) {
      if (scope._JSONProcedures[j].appName == appName) {
        appIndx = j;
        break;
      }
    }

    var databaseProcedures = scope._JSONProcedures[appIndx].rpc;
    //create the output to build the topics select drop-down options

    var JSONProceduresForUI = [];

    for (var i = 0; i < databaseProcedures.length; i++) {
      JSONProceduresForUI.push({
        name: databaseProcedures[i].name,
        description: databaseProcedures[i].description
      });
    }
    return JSONProceduresForUI;

  }

  // In case a request is received and no data are cached,
  // fetch at first all available apps
  if (typeof this._lastDBAccess == 'undefined') {

    var that = this;

    this.getApps(function(status, result) {

      return fetchProcedures(appName, that);

    });

  } else {

    return fetchProcedures(appName, this);

  }

}


DatabaseManager.prototype.getProcedureParameter = function(appName, procedureName) {

  //this is where we need to get the list of Topics, split it up and return it to the UI
  //topics: temperature1,humidity1,gyro1,light1

  var fetchProcedureParameter = function(appname, procedurename, scope) {
    var appIndx = 0;
    for (var j = 0; j < scope._JSONProcedures.length; j++) {
      if (scope._JSONProcedures[j].appName == appName) {
        appIndx = j;
        break;
      }
    }
    var databaseProcedures = scope._JSONProcedures[appIndx].rpc;
    //create the output to build the topics select drop-down options
    var JSONProcedureParameter = [];

    for (var i = 0; i < databaseProcedures.length; i++) {

      if(databaseProcedures[i].name === procedurename){
        JSONProcedureParameter = databaseProcedures[i];
        break;
      }

    }
    return JSONProcedureParameter;

  }

  // In case a request is received and no data are cached,
  // fetch at first all available apps
  if (typeof this._lastDBAccess == 'undefined') {

    var that = this;

    this.getApps(function(status, result) {

      return fetchProcedureParameter(appName, procedureName, that);

    });

  } else {

    return fetchProcedureParameter(appName, procedureName, this);

  }

}

module.exports = exports = new DatabaseManager();
