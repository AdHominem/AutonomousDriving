
/* Continental Automotive AG, foss@continental-corporation.com 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict'

var autobahn = require('autobahn');
var Torque2Wamp = require('./Torque2Wamp.js').cTorque2Wamp;
var cPersonaPlayer = require('./PersonaPlayer.js').cPersonaPlayer;

var torque2wamp = new Torque2Wamp();
//var obddata = torque2wamp.getPoint(0);

//default ip from hackteam1 
var url = 'ws://' + process.argv[2] + ':8080/ws';
var connection = new autobahn.Connection({
    url: url,
    realm: 'realm1',
    authextra: {service_name: 'obd-worker'}
});

connection.onopen = function (session) {
    console.log("connection open")
    
    //remote procedure of topic -> conti.obdserver.getpoint
    function getPoint(args) {
        console.log("called getPoint RPC with: ", args[0]);
        var loc_data = torque2wamp.getPoint(args[0]);
        var retval = {};
        for(var itmp in loc_data.names) {
            retval[loc_data.names[itmp]] = loc_data.values[itmp];
        }
        retval['coordinates'] = loc_data.coordinates;
        var retval_json = JSON.stringify(retval)
        return retval;
    }
    //register a procedure to get vehicle data sample
    session.register('conti.obdserver.getpoint', getPoint);
    PersonaPlayer = new cPersonaPlayer(session,torque2wamp);
};
connection.open();