# wamp2polymer View

Prerequesite:

- [nodejs version 6.11.x](https://nodejs.org/en/download/)
- [bower](https://bower.io/)

## Description
This HTML Web Component shows all vehicle data comming from OBD Worker in your Web Browser. Furthermore you can change used persona of
OBD Worker and VideoPlayer.
It is based on [polymer](https://www.polymer-project.org/) and provides a minimal example on how to encapsulate WAMP in a Polymer Web Component.

## Quickstart
Go to the working directory of wamp2polymer

```
cd repo_root/service_worker/wamp2polymer
```

install application 
```
cd public
bower install
cd ..
npm install
```

change service router ip or hostname [here](https://github.com/continental-software/hackathon/blob/master/service_worker/wamp2polymer/public/index.html#L29):

```
<conticloud-vehicledata id="vehicle" wampip="192.168.40.12x" />
```

start application
```
node polyapp.js
```
open http://localhost:6001 in browser.


### **Provided topics**

Topic       | Description
-------------- |  ----------------------------------
conti.wamp2polymer.persona    | persona you want to get data from OBD Worker persona_1 persona_2 persona_3 and persona_4

### **Listening topics**

Topic       | Description
-------------- |  ----------------------------------
conti.obdserver.*vehicle data*          |  all vehicle data from cdata field of kml file as seperate topic (e.g. conti.obdserver.speed etc.)


### **Registered callbacks**
- none

### **Used callbacks**
Topic       | Description
-------------- |  ----------------------------------
conti.videoplayer.source    | persona you want to get data from video player persona_1 persona_2 persona_3 and persona_4
 

### **Source Overview**

Component       | Description
-------------- |  ----------------------------------
app.js             |  main express web server
index.html         |  web page entry point
conticloud.html    |  minimal polymer example provides vehicle data in a simple table


open node-red in your browser and [load configuration](url zu video tutorial) node-red-config.json
<picture node red>
