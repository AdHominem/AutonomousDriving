# OBD Worker Model
Prerequesite:
[nodejs version 6.11.x](https://nodejs.org/en/download/)

## Description
OBD Worker is a nodejs Application and provides vehicle data of desired persona. Therefore vehicle data is stored in a KML file and is separated for each persona.
You can find them in folder **kml_obd_torque**. It is stored in sample/second.
Furthermore you can manipulate this vehicle data in the descripton field of each kml file:

~~~xml
            <description>
                <![CDATA[<b>Time</b>:&nbsp;25-Apr.-2017 11:07:06.325<br /><b>Speed</b>:&nbsp;0mph<br />]]>
            </description>
~~~

## Quickstart
Go to the working directory of OBD Worker

```
cd repo_root/service_worker/obd_worker
```

install npm packages
```
npm install
```

execute obd worker with ip address of service router. Where X is the number of your team (1,2,3 or 4).
```
node obdapp.js 192.168.40.12x
```


### **Provided topics**

Topic       | Description
-------------- |  ----------------------------------
conti.obdserver.*vehicle data*          |  all vehicle data from cdata field of kml file as seperate topic (e.g. conti.obdserver.time , conti.obdserver.Speed , etc.)
conti.obdserver.coordintes               |  current position of vehicle long/lat 

### **Listening topics**

Topic       | Description
-------------- |  ----------------------------------
conti.wamp2polymer.persona      |  imlemented by [wamp2polymer](https://github.com/continental-software/hackathon/tree/master/service_worker/wamp2polymer) persona you want to get data from persona_1 persona_2 persona_3 and persona_4
conti.videoplayer.time          |  Trigger for provided topics (unit=second). Publishes vehicle data of requested time


### **Registered callbacks**

Topic       | Description
-------------- |  ----------------------------------
conti.obdserver.getpoint          |  Returns complete vehicle data sample of requested time (unit=second)

### **Used callbacks**
- none 
 

### **Source Overview**

Component       | Description
-------------- |  ----------------------------------
obdapp.js          |  Main file open WAMP connection and provide session to cPersonaPlayer (provides RPC to get complete sample)
PersonaPlayer.js   |  Facade between obdapp.js and Torque2Wamp sends vehicle data due to provided time
Torque2Wamp.js     |  KML file parser substitutes unknown characters from cdata

open node-red in your browser and [load configuration](url zu video tutorial)
<picture node red>