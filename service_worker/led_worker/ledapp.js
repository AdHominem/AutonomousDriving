
/* Continental Automotive AG, foss@continental-corporation.com 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


 /**
 * Worker utilzation LED visualization
 * shows activity of connected worker with LED Stripe with frequency and color
 * @main PersonaPlayer
 */
'use strict'

var autobahn = require('autobahn');
var cWorkerMonitor = require('./WorkerMonitor.js').cWorkerMonitor;


//open wamp connection
var url = 'ws://' + process.argv[2] + ':8080/ws';
var connection = new autobahn.Connection({
    url: url,
    realm: 'realm1'
});

connection.onopen = function (session) {
    console.log("connection open")
    //Worker Visualization Instance connecting to LED's
    var WorkerMonitor = new cWorkerMonitor(session);
    WorkerMonitor.start();
};
connection.open();