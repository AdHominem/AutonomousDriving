
/* Continental Automotive AG, foss@continental-corporation.com 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict';

let g_videoelement = "not defined";
/***********************************************************************************************
 * this class is responsible for interaction with OBDWorker, controlls of Video Player enables you 
 * to controll the OBDWorker, means you get vehicle data of current video time every second.
 * @class cVideo2Wamp
 ************************************************************************************************/
class cVideo2Wamp {
    constructor(arg_ip) {
        this.lasttime = 8; //could also be any other number
        const loc_url = "ws://" + arg_ip + ":8080/ws";
        /*if (arg_ip.length === 14 || arg_ip.length === 15) {
            loc_url = 'ws://' + arg_ip + ':8080/ws';
        } else {
            throw new Error('wrong IP format');
        }*/
        this.wampConnection = new autobahn.Connection({
            url: loc_url,
            realm: "realm1",
            authextra: {service_name: 'video-worker'}
        });
        this.wampConnection.open();
        this.wampConnection.onopen = (session) => {
            console.log("Connection OBDWorker session open");
            this.session = session;
            //register callback for changing persona video
            this.session.register("conti.videoplayer.source", cVideo2Wamp.ChangePersona).then(
                () => {
                    console.log("procedure changePersonaVideo() registered");
                },
                (err) => {
                    console.log("failed to register procedure: " + err);
                })
        }
    }

    /**
     * Send current Time of Video to OBDWorker
     * @function
     * @param   arg_currentTime    current time of KML File index in seconds with zero offset
     */
    setCurrentTime(arg_currentTime) {
        const obd_cmd = {};
        obd_cmd.topic = "time";
        obd_cmd.payload = Math.round(arg_currentTime);
        console.log("timestamp -> " + obd_cmd.payload);
        //send only if current time changed in range of seconds
        if (this.lasttime !==  obd_cmd.payload) {
            this.lasttime = obd_cmd.payload;
            //                   topic:                           payload:
            this.session.publish("conti.videoplayer.time", [obd_cmd])
        }
    }

    /**
     * set dom element of video player to get source selector  
     * @function
     * @param   {object}  arg_vid  dom object video element 
     */
    static setVid(arg_vid) {
        g_videoelement = arg_vid; 
    }

    /**
     * change persona video
     * @function
     * @param   {string}   arg_persona video file name persona_1-4
     * @return {string}
     */
    static ChangePersona(arg_persona) {
        if (g_videoelement !== "not defined") {
            const personaValidation = new RegExp("^persona_[1-4]");
            if (personaValidation.test(arg_persona)) {
                const persona_source = g_videoelement.getElementsByTagName("source");
                persona_source[0].src = arg_persona + ".mp4";
                g_videoelement.load();
                return "successfully loaded";
            } else { return "no such persona"; }
        } else { console.log("no video element available") }
    }
};


