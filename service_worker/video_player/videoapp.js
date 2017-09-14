/* Continental Automotive AG, foss@continental-corporation.com 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Hackathon Persona Backend Part
 * @main PersonaPlayer
 */
'use strict';
//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------
// first checkin team server
// This application uses express as its web server
// for more info, see: http://expressjs.com
const express = require('express');
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
const cfenv = require('cfenv');
// create a new express server
const app = express();
// get the app environment from Cloud Foundry
const appEnv = cfenv.getAppEnv();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

const server = app.listen(appEnv.port, function () {
    console.log("server starting on " + appEnv.url);
});
