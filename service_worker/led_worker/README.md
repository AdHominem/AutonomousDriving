# LED Worker

Monitor the activity of following Workers:

- [obd worker](https://github.com/continental-software/hackathon/tree/master/service_worker/obd_worker)
- [video player](https://github.com/continental-software/hackathon/tree/master/service_worker/video_player)
- [wamp2polymer](https://github.com/continental-software/hackathon/tree/master/service_worker/wamp2polymer)

Worker activity is visualized with different colors on a LED Stripe. For this make shure that the [LED Slave](https://github.com/continental-software/hackathon/tree/master/service_worker/led_worker/PiSlave) is running. This Worker is just monitoring the activity.

OBD Worker   -> RED LED's
Wamp2Polymer -> Green LED's
Video Player -> Blue LED's


## Subscribed Topics 

Topic       | Description
-------------- |  ----------------------------------
conti.obdserver.*vehicle data*          |  [obd worker](https://github.com/continental-software/hackathon/tree/master/service_worker/obd_worker) all vehicle data from cdata field of kml file as seperate topic (e.g. conti.obdserver.time , conti.obdserver.Speed , etc.)
conti.wamp2polymer.persona           |  Provide by: [wamp2polymer](https://github.com/continental-software/hackathon/tree/master/service_worker/wamp2polymer) Persona request 
conti.videoplayer.time               |  [video player](https://github.com/continental-software/hackathon/tree/master/service_worker/video_player) current video time