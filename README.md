# continental.cloud Hackathon

Welcome to the continental.cloud Hackathon.
Now that you've found your way to the github repo here are the first steps to start with.

When your idea is ready you might split up your team into several roles, based on your skillset.
For example:
- Service / Backend developer
- HMI Developer 
- Designer
- Presentation & Knowledge

How to start the implementation is dependet on your role. Here is what we have to help you with this.
If you have a questions you can always ask our experts to help you.

## 1.) Basic Components and architecture

On every table is a service router (box with the display). The router has the IP address:

IP 192.168.40.121 (hackteam1.local)  
IP 192.168.40.122 (hackteam2.local)  
IP 192.168.40.123 (hackteam3.local)  
IP 192.168.40.124 (hackteam4.local)  

This service router has an instance of [crossbar.io](http://crossbar.io/docs/Getting-Started/) running.
Everyone in your hackteam connected to the router can publish and subscribe to different topics to exchange data between each other.


## 2.) First steps as a Service / Backend developer

### Get something running

The best starting point is to connect some of our [examples](https://github.com/continental-software/hackathon/tree/master/service_worker) to the service manager.
The examples are collaborative microservices, that are talking to each other over [Publish/Subscribe and Remote Procedure Call Communication Patterns](https://crossbar.io/about/Basic-Concepts/).
These are the basics the developer has to know to start beeing part of our ecosystem! 

For every [worker](https://github.com/continental-software/hackathon/tree/master/service_worker) there is a quickstart in the corresponding directory.
If you start the worker by connecting it to your router, it should popup directly in the visualization screens.

The Hackathon framework is programming language agnostic. So you can use nodejs, C/C++, Java, Python etc.  
All the examples can be used as a template for your own service or you can write them from scratch all you need is the [Autobahn SDK](http://crossbar.io/autobahn/) to connect your Service.

### Configure your services

You can configure all services by the graphical interface node-red.
Just open the service configurator within your browser.:

http://192.168.40.12x:1880 (where x is the number of your team)

You can add the configuration of every service by pasting the example configuration node-red-config.json which is located by the examples.
Have a look at the [videotutorial](http:giturl) how the configuration is managed with node-red.

## 3.) First steps as a HTML5 - App Developer or UX-Designer

For developing an Application you can use your common set of tools.
The only requirement is to provide an html5 application, which can be served by a web server. 
All Applications should be connected to the service router to send and receive data.
This can be done by using our application templates or do it yourself by implementing the [Autobahn SDK](http://crossbar.io/autobahn/).

### Get something running

To connect the application to the services of your hackteam we have some examples as a starting point.
Every [worker](https://github.com/continental-software/hackathon/tree/master/service_worker) in the service_worker directory has some UI elements.
They show examples of an UI-Element that gets access to data and reacts on input of the service.

### Develop your own application

The easiest way to start is by coping one of our samples and use them as template.
The [video_player](https://github.com/continental-software/hackathon/blob/master/service_worker/video_player/) shows how to publish an event to the service router.

If you want to receive data you can have a look at -- ?
The example is based on a [polymer](Polymer.io/getstarted) list-element .

We recommend working with polymer for app development. How to use polymer and some advanced examples are shown in the [Polymer Introduction] (https://github.com/continental-software/hackathon/tree/master/app_tutorial/polyIntro)

Above that, if you like some basic UI-Elements we recommend using [Onsen-UI](https://onsen.io/v2/guide/).
There you can get [basic components](https://onsen.io/v2/api/js/) for the app, eg. page navigation, buttons or toolbars for your application.
Of course page navigation and buttons can also be implemented using the polymer navigator from the polymer element catalog.

When using Onsen-UI and Polymer at the same time we have an [advanced tutorial](https://github.com/continental-software/hackathon/tree/master/app_tutorial/ons-intro) to show how they can be combined.

### Deploy the application at demonstrator

When the application is ready place your app on service router.
Connect over ssh/scp to your service_router in the folder /hackathon/AppServer.
Please contact the experts to get the ssh password or if you need help.
Then only start the AppServer and you can try out the App in the Demonstrator.
