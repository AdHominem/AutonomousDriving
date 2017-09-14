var util = require('util');
var EventEmitter = require('events').EventEmitter;

// The AutobahnManager manages the whole connectivity between any WAMP Nodes in Node-Red
// and the WAMP-Server. It makes sure that all subscribes occurs once and
// if no connection is available, it puts the topics into a queue.

function AutobahnManager() {

  "use strict";

  var autobahn = require('autobahn');

    // the URL of the WAMP Router (Crossbar.io)
  //this._wsuri = "ws://192.168.1.28:8080/ws";

  this._wsuri = 'ws://' + process.argv[2] + ':8080/ws';
  console.log("################# Service Router #####################");
  console.log(this._wsuri);
  console.log("################# Service Router #####################");
  //this._wsuri = "ws://192.168.178.28:8080/ws"; //Raspberry
    //this._wsuri = "ws://192.168.99.100:8080/ws"; //How to get this IP? -> albert@windows $docker-machine ip default
  this._realm = "realm1";

  // the WAMP connection to the Router
  this._connection = new autobahn.Connection({
    url: this._wsuri,
    realm: this._realm,
    authextra: {service_name: 'node-red-wamp'}
  });

  if (!this._connection.isConnected) {

    this._connection.open();

    var that = this;
    this._connection.onopen = function(session) {

        // Emit info that a connection to WAMP exists.
        that.emit('com.AutobahnManager.status', true);

        for (var i in that._subsQueue) {
          that.subscribe(that._subsQueue[i].subscription, that._subsQueue[i].listener);
        } // for-loop

        that._subsQueue = [];

      } // onopen function
  } // if

  this._connection.onclose = function(reason, details) {

    console.log('::: AutobahnManger closes connection to WAMP: ' + reason + ' :::');
    that.emit('com.AutobahnManager.status', false);

  }

  this._subsQueue = []; // Queue for topics and listeners which registers during no wamp connection available
  this._unSubRunning = false; // Boolean to recognized whether unsub process is currently running or not - If yes put new registriations of topics in th queue
  this._unSubProc = []; // Array to recognized when all unsubs are done

};

// extend the EventEmitter class using our AutobahnManager class
util.inherits(AutobahnManager, EventEmitter);

AutobahnManager.prototype.subscribe = function(subscription, listener) {

  // If the connection to WAMP is not ready or Autobahn is running unsub process
  // so put new topics into the queue

  if (!this._connection.isOpen || this._unSubRunning) {

    this._subsQueue.push({

      subscription: subscription,
      listener: listener

    });

  } else {

    // Connection to WAMP Server exist

    if (this.listeners(subscription).length == 0) {

      // Listener already available for this topic;

      this._connection.session.subscribe(subscription, this._onReceived.bind({
        scope: this,
        topic: subscription
      })).then(

        function(sub) {
          console.log("+++ AutobahnManager successfully subscribed to topic:" + sub.topic + ' +++');

        },
        function(err) {
          console.log("+++ AutobahnManager failed to subscribed: " + err + ' +++');
        }
      );

    }
    this.on(subscription, listener);
  }

}

AutobahnManager.prototype._onReceived = function(result, kwargs, details) {

  console.log('::: AutobahnManager received Data for Topic: ' + this.topic + ' :::');
  loc_msg = {
    value: result,
    topic: this.topic
  }
  this.scope.emit(this.topic, loc_msg);

}

AutobahnManager.prototype._subMissingTopics = function() {

  this._unSubRunning = false;

  for (var i in this._subsQueue) {

    this.subscribe(this._subsQueue[i].subscription, this._subsQueue[i].listener);

  } // for-loop

  this._subsQueue = [];

}

AutobahnManager.prototype.unsubscribe = function(topic, listener) {

  if (this._connection.isConnected) {

    this._unSubRunning = true;

    this.removeListener(topic, listener);

    var activeSubscription = this._connection.session.subscriptions;

    for (var i in activeSubscription) {

      if (activeSubscription[i].length > 0 && activeSubscription[i][0].topic === topic) {

        // Like a counter to check whether all unsubs are done or not - see the pop method in the callback of unsubscribe
        this._unSubProc.push(topic);

        var sessionToUnsub = activeSubscription[i][0];
        // Topic is available and subscribed, so unsub now
        var that = this;

        this._connection.session.unsubscribe(sessionToUnsub).then(
          function(gone) {

            if (that._unSubProc.length > 0) {
              that._unSubProc.pop();
            }
            if (that._unSubProc.length == 0) {
              that._subMissingTopics();
            }

            console.log('--- AutobahnMananger: successfully unsubscribed: ' + sessionToUnsub.topic + ' ---');

          },
          function(error) {

            console.log('--- AutobahnManager: unsubscribe failed: ' + sessionToUnsub.topic + ' ---');

          }
        );
      } // if activeSubscription.topic === topic
    } // for-loop
  } // if connection to wamp server available

}

AutobahnManager.prototype.publish = function(topic, data) {

  if (!this._connection.isConnected) {

    this._connection.open();

    var that = this;
    this._connection.onopen = function(session) {
        session.publish(that.topic, that.data);
      //payload published as string
      //session.publish(that.topic, [JSON.stringify(that.data)]);

    }
  } else {
    //published as string
    //this._connection.session.publish(topic, [JSON.stringify(data)]);
      this._connection.session.publish(topic, data);
  }

}

// This method is calling the Autobahn Call function which is invoke the RPC method on the WAMP server
AutobahnManager.prototype.call = function(subscription, parameters, callback) {

  console.log('::: AutobahnManager call RPC: ' + subscription + ' with parameters: ' + JSON.stringify(parameters) + ' :::');
  this._connection.session.call(subscription, parameters).then(
    function(result) {
      callback(result);
    },
    function(error) {
      callback(error);
    });

}

Object.defineProperty(AutobahnManager.prototype, "connect", {
  get: function() {
    return this._connection.isConnected;
  }
});

module.exports = exports = new AutobahnManager();
