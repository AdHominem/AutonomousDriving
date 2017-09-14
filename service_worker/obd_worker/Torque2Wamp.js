
/* Continental Automotive AG, foss@continental-corporation.com 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict'

var tj = require('togeojson');
var fs = require('fs');
var htmlToText = require('html-to-text'),
    DOMParser = require('xmldom').DOMParser;

/**
 * KML File Parser. Puplishes requested point of interest from KML file 
 */
class cTorque2Wamp {
    constructor() {
        var kml = new DOMParser().parseFromString(fs.readFileSync(__dirname + '/kml_obd_torque/persona_1.kml', 'utf8'));
        this.converted = tj.kml(kml);
        var date_start = this.getPoint(0);
        var date_end = this.getPoint((this.converted.features.length - 1))
        var start_hourMinSec = date_start.values[0].split("\ ")[1].split(".")[0].split(":");
        var end_hourMinSec = date_end.values[0].split("\ ")[1].split(".")[0].split(":");
        var start_seconds = parseInt(start_hourMinSec[0]*60*60) + parseInt(start_hourMinSec[1]*60) + parseInt(start_hourMinSec[2]);
        var end_seconds = parseInt(end_hourMinSec[0]*60*60) + parseInt(end_hourMinSec[1]*60) + parseInt(end_hourMinSec[2]);
        this.recordtime = end_seconds - start_seconds;
    }
    /**
     * Change used KML file 
     * @function
     * @param   {number}    kmlfilename - name of KML File
     */
    ChangePersona(kmlfilename) {
        var kml = new DOMParser().parseFromString(fs.readFileSync(__dirname + '/kml_obd_torque/' + kmlfilename, 'utf8'));
        this.converted = tj.kml(kml);
        var date_end = this.getPoint((this.converted.features.length - 1))
        var start_hourMinSec = date_start.values[0].split("\ ")[1].split(".")[0].split(":");
        var end_hourMinSec = date_end.values[0].split("\ ")[1].split(".")[0].split(":");
        var start_seconds = parseInt(start_hourMinSec[0]*60*60) + parseInt(start_hourMinSec[1]*60) + parseInt(start_hourMinSec[2]);
        var end_seconds = parseInt(end_hourMinSec[0]*60*60) + parseInt(end_hourMinSec[1]*60) + parseInt(end_hourMinSec[2]);
        this.recordtime = end_seconds - start_seconds;
    }

    /**
     * Represents a sample of Obd Data stored in KML file. Index == Second
     * @function
     * @param   {number}    arg_index - index of obd sample in kml file
     * @returns  ret_msg - point of interest
     */
    getPoint(arg_index) {
        var converted = this.converted;
        if (converted.features.length > arg_index) {
            var text = htmlToText.fromString(converted.features[arg_index].properties.description, {
                wordwrap: 130
            });
            var point = text.split('\n');
            var loc_names = [];
            var loc_values = [];
            for (var index in point) {
                var loc_tmp = point[index].split(': ');
                loc_names[index] = loc_tmp[0].toLowerCase();
                loc_names[index] = loc_names[index].replace(/\(|\s|\)|â°|\/|%/g, "_");
                loc_values[index] = loc_tmp[1];
            }
            //console.log('"' + loc_names + '"' + ",");
            var ret_msg = {
                names: loc_names,
                values: loc_values,
                coordinates: converted.features[arg_index].geometry.coordinates
            }
            console.log(+ ret_msg.names[0] + " -> " + ret_msg.values[0])
            return ret_msg;
        } else {
            console.log("index out of scope")
            return "outofscope";
        }
    }
}

exports.cTorque2Wamp = cTorque2Wamp;
