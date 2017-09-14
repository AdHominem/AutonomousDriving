# Video Player Controller
Prerequesite:
[nodejs version 6.11.x](https://nodejs.org/en/download/)

## Description
Video Player is a nodejs Application that provides a video of personas journey
This worker is synchronized with [OBD Worker](https://github.com/continental-software/hackathon/tree/master/service_worker/obd_worker) so you are getting  vehicle data related to current video time.

## Quickstart
Go to the working directory of Video Player

```
cd repo_root/service_worker/video_player
```

install npm packages
```
npm install
```

change ip address or hostname in code to connect your service router [here](https://github.com/continental-software/hackathon/blob/master/service_worker/video_player/public/index.html#L21):
![Worker Overview](https://github.com/continental-software/hackathon/blob/master/service_worker/pics/code_videoplayer.png)


execute video worker.
```
node videoapp.js
```


### **Provided topics**

Topic       | Description
-------------- |  ----------------------------------
conti.obdserver.time          |  current video time

### **Listening topics**

- none

### **Registered callbacks**

Topic       | Description
-------------- |  ----------------------------------
conti.obdserver.source          |  change persona video persona_1-4

### **Used callbacks**
- none 
 

### **Source Overview**

Component       | Description
-------------- |  ----------------------------------
app.js          |  main express web server
video2wamp.js   |  wamp connection for change persona video file and puplish current video time
index.html      |  simple html view on persona video

open node-red in your browser and [load configuration](url zu video tutorial)
<picture node red>