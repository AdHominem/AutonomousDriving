# Conti_Hackathon

# Overview
This repository contains source code of five different microservice programs called worker.
You can use them as a template in your Team. Each member could put one worker into operation. This ensures that each member has code, where he can implement his service and is able to interact with each other over a [crossbar node](http://crossbar.io/) called servcie router. 
Also a Tool is available called node-red, where you can create and connect services via drag & drop without programming skills. Therefore [video tutorials](git url videos) are availble.

![Worker Overview](https://github.com/continental-software/hackathon/blob/master/service_worker/pics/workeroverview.png)

Worker are communicating over the [autobahn](http://crossbar.io/autobahn/) interface via pub/sub and remote procedure calls.

Workers are organized within two design patterns Model View Controller and Master/Slave.

## What are they doing
Workers purpose is to make personas everyday life a tangible example. You can see persona journeys as a video with the [videoplayer worker], this is the controller worker which is synchronized with the OBDWorker worker. The OBDWorker is the Vehicle Model and provides reallife Vehicle data. which are stored in a [kml](https://de.wikipedia.org/wiki/Keyhole_Markup_Language) File.
The Wamp2Polymer Web Component shows data send from OBD Worker in a Polymer based Web Component. 
The LED Worker is splitted into WorkerMonitor Master and LED Slave. WorkerMonitor tracks the activity of:

 - [x] OBD Worker with red LED's 
 - [x] polymer2wamp with green LED's 
 - [x] videoplayer with blue LED's 

So the commissioning is completed if the led stripe shows that the workers are active.

 


