

/* Continental Automotive AG, foss@continental-corporation.com 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict'


/**
 * Monitors Hackathon Worker Examples with LED Stripe
 * OBD Worker => Red LED (0-10)
 * wamp2polymer => Green LED's (10-20)
 * videoplayer => Blue LED's  (20-30)
 * @class
 */
class cWorkerMonitor {
    constructor(session) {
        this.current_index = 0;
        this.WampSession = session;
        this.obdserver = {
            cmd: "off",
            counter: 0
        };
        this.wamp2polymer = {
            cmd: "off",
            counter: 0
        };
        this.videoplayer = {
            cmd: "off",
            counter: 0
        };
        this.WampSession.subscribe('conti.obdserver', this.count_obdworker.bind(this), { match: "prefix" }).then(
            function (sub) {
                console.log('subscribed to topic obd');
            },
            function (err) {
                console.log('failed to subscribe obd server', err);
            }
        );
        this.WampSession.subscribe('conti.wamp2polymer', this.count_wamp2polymer.bind(this)).then(
            function (sub) {
                console.log('subscribed to topic polymer');
            },
            function (err) {
                console.log('failed to subscribe wamo2polymer', err);
            }
        );
        ;
        this.WampSession.subscribe('conti.videoplayer', this.count_videoplayer.bind(this)).then(
            function (sub) {
                console.log('subscribed to topic videoplayer');
            },
            function (err) {
                console.log('failed to subscribe videoplayer', err);
            }
        );
        ;
    }
    start() {
        var that = this;
        this.ledtimer = setInterval(function () {
            // that.WampSession.call("conti.smartcity.workerVisualization", ["fast", "fast", "fast"])
            that.WampSession.call("conti.smartcity.workerVisualization", [that.obdserver.cmd, that.wamp2polymer.cmd, that.videoplayer.cmd])
            that.obdserver.cmd = "off";
            that.obdserver.counter = 0;
            that.wamp2polymer.cmd = "off";
            that.wamp2polymer.counter = 0;
            that.videoplayer.cmd = "off";
            that.videoplayer.counter = 0;
        }, 2000).bind(this)
    }

    /**
     * subscribe all topics with prefix conti.obdserver
     * @function
     * @param   arg_cmd published data
     */
    count_obdworker(arg_cmd) {
        this.obdserver.counter += 1;
        var loc_count = this.obdserver.counter;
        if (loc_count > 10) {
            this.obdserver.cmd = "fast";
        } else {
            loc_count >= 5 ? this.obdserver.cmd = "mid" : this.obdserver.cmd = "slow";
        }
    }
    /**
     * subscribe all topics with prefix conti.wamp2polymer
     * @function
     * @param   arg_cmd published data
     */
    count_wamp2polymer(arg_cmd) {
        this.wamp2polymer.counter += 1;
        var loc_count = this.wamp2polymer.counter;
        if (loc_count > 10) {
            this.wamp2polymer.cmd = "fast";
        } else {
            loc_count >= 5 ? this.wamp2polymer.cmd = "mid" : this.wamp2polymer.cmd = "slow";
        }
    }
    /**
     * subscribe all topics with prefix conti.videoplaye
     * @function
     * @param   arg_cmd published data
     */
    count_videoplayer(arg_cmd) {
        this.videoplayer.counter += 1;
        var loc_count = this.videoplayer.counter;
        if (loc_count > 10) {
            this.videoplayer.cmd = "fast";
        } else {
            loc_count >= 2 ? this.videoplayer.cmd = "mid" : this.videoplayer.cmd = "slow";
        }
    }
}

exports.cWorkerMonitor = cWorkerMonitor;