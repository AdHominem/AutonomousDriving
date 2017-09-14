

/* Continental Automotive AG, foss@continental-corporation.com 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict'


/**
 * Player for Persona Test Drive Video and connection to Vehicle Data received from OBD Dongle. 
 * Data is stored in kml_obd_torque folder. Data is recorded in one second samples. 
 * @class
 */
class cPersonaPlayer {
    constructor(session, arg_torque2wamp) {
        this.current_index = 0;
        //connect to session of (obdapp.js)
        this.torque2wamp = arg_torque2wamp;
        this.WampSession = session;
        session.subscribe('conti.videoplayer.time', this.Time.bind(this));
        session.subscribe('conti.wamp2polymer.persona', this.changePersona.bind(this));
    }
    /**
     * subscribe callback for conti.wamp2polymer.persona for ctrl of video player sync and persona selection
     * @function
     * @param   {string}    arg_cmd - ["persona_1-4"] 
     * @returns {number}    ret_msg -  != 0 -> Failure
     */
    changePersona(arg_cmd) {
        this.current_index = 0;
        var kmlfile = arg_cmd[0].payload + ".kml";
        this.torque2wamp.ChangePersona(kmlfile);
    }
    /** conti.videoplayer.time
     * send vehicle data with time equal to kml file index (samples in seconds === index )
     * @function
     * @param   {number}    arg_cmd - index of obd sample in kml file
     * @returns {number}    ret_msg -  != 0 -> Failure
     */
    Time(arg_cmd) {
        this.current_index = arg_cmd[0].payload;
        var obddata = this.torque2wamp.getPoint(this.current_index);
        if (obddata !== "outofscope") {
            var session = this.WampSession
            for (var ii in obddata.names) {
                session.publish('conti.obdserver.' + obddata.names[ii], [obddata.values[ii]]);
            }
            session.publish('conti.obdserver.coordinates', obddata.coordinates)
            this.current_index += 1;
        } else {
            console.log("starting again from index 0")
            this.current_index = 0;
        }
    }
}

exports.cPersonaPlayer = cPersonaPlayer;