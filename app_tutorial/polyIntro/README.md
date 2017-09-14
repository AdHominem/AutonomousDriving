+ [Polymer Introduction](#intrp)
  - [Serve a web application with node](#hackaton)
  - [Web components and Polymer](#polymer)
  - [Installing Polymer and Web Components](#installing) 
  - [Structure of samples](#structure) 
  - [Basic usage of polymer elements and templates](#htmlusingpoly)
  - [Polymer pages and applications](#appsandpages)
  - [Using css libs in Polymer](#usingcss)
  - [Routing sample with polymer](#routing)

<h2 id="intro">Polymer Introduction</h2>

<h3 id="hackaton">1. Serve a web application with node</h3> 

In order to serve an application, a local web server is required. Node js provides a general purpose server platform with static file servers available. In the Hackaton node runs on a raspberry, For test purposes or in other cases, a local web server can be installed on linux, mac or windows (as a node js application)
  
```
  sudo apt-get install nodejs   // on linux
  sudo apt-get install npm      // on linux
  npm install local-web-server
  cd /path-to-application
  ws -p 8080
  -- the application can now be opened in localhost:8080 in a browser
```
  
This is only one static file server among many in the node platform. In the polymeer tool chain, another file server is included. (see below).  
  
Our sample application templates and polymer introduction samples can be served this way by a node server.  
  
We provide polymer as a sample GUI and application framework for the Hackton. This Framework has not necessarily to be used,
if some simple HTML output does the work for the Hackaton sample. We dont provide other frameworks here, but they can be used in the Hackaton. In the Automotive world however, with always limited ressources, it is always important to follow the Google base ideas of #UseThePlatform.  

Besides some introduction samples we provide two application sample templates which can be used out of the box. This application samples are chosen from the Polymer application-layout element, with more samples for polymer pages available in the demo folders of  
  
```
  https://www.webcomponents.org/element/PolymerElements/app-layout
```
   
In order to provide elements, which support elements for routing of pages, we have a simple solution for combining Onsen UI Routing elements with polymer. This is for now not yet a general solution for combining Polymer and Onsen UI, but works in the suggested manner.  

We provide these application templates in the Onsen UI introduction. There just explain the use of the templates is explained, for an Onsen UI introduction, the Onsen UI introduction for Javascript has to be followed.  
  
```
  http://tutorial.onsen.io/
  https://onsen.io/v2/api/js/
```  
  
A routing sample with polymer is available in the polymer starter Kit. (see below)  
  
<h3 id="polymer">2. Web components and Polymer</h3>
  
This introduction does not replace any other documentation for polymer. It should give some hints for the introduction and installation of polymer. Polymer is a small layer on top of web components, adding a powerful data binding system.  
  
The Web components Standard consists of the following  APIs:  

  - Templates: templates for DOM elements  
  - Custom Elements: Definition of Custom HTML5 elements (Components)  
  - Shadow Dom: encapsulation for Custom HTML5 elements  
  - Imports: Import of html in html  

These standards are in the meantime supported by most browsers (Chrome, Safari, Firefox ) except imports, which are not yet finalized in the standard.  

Public Web components are available on: 

```
  https://www.webcomponents.org
```

For each component documentation and live examples are provided.  

On this location among others, the following Google component collections are provided:  

  - iron-elements: basic elements and behaviors (e.g iron-ajax)  
  - paper-elements: paper style input and output elements  
  - layout-elements: layout helpers (infinite-list, overlay, swipe)  
  - app-elements: application helpers (layouts, route, storage)  
  - data-elements: data storage local and on the web  
  - gold-elements: credit card verification  
  - google-web-components: elements wrapping google API services  
  - platinum-elements: further helpers (bluetooth)  

In our samples paper and iron elements are included. The demo samples of the components are included in the demo folder of the components in the bower_components folder and can be served by a local file server.  
  
<h3 id="installing">3. Installing Polymer and Web components</h3>
  
Polymer is a small layer on top of web components, adding bidirectional
data binding to the standards. Polymer also provides a development environment for web components. Web components can be downloaded from the bower package manager e.g. downloading a polymer component from bower:
  
```
   npm install -g bower  // install bower from npm, sudo required on linux
   cd /path-to-project
   bower install --save Polymer/polymer#^2.0.0       // install polymer 2.0
   bower install --save PolymerElements/paper-button#^2.0.0 // install an 2.0 element
         (the element is installed in the bower_components directory)
```
The polymer command line interface (CLI) provides a comprehensive environment for developing web and html5 applications. They are not required in the hackaton scenario, although linting as part of the CLI is always helpful.

```
    npm install -g polymer-cli    // install polymer-cli from npm, sudo required on linux
    npm update polymer-cli        // Polymer 2.0 update
```
    
    if this install requires a newer version of node, node has to be upgraded:
    (in linux distributions older versions of npm are distributed and have to be updated)

```
     sudo npm cache clean -f       // linux only
     sudo npm install -g n         // linux only
     sudo n stable                 // linux only
 OR  sudo n 7.8.0 (newest version) // linux only
```
    usage:
```
    cd /path-to-project
    polymer action   //    action is one of:

      init - Create a new Polymer project from pre-configured starter templates
      install - Install dependencies and dependency variants via Bower
      serve - Serve elements and applications during development
      lint - Lint a project to find and diagnose errors quickly
      test - Test your project with web-component-tester
      build - Build an application optimized for production
```

In the following samples polymer 2.0 and polymer hybrid elements are used. Polymer 2.0
is used in our samples and should be used in the hackaton. Polymer 2.0 is an update compliant with the latest web component standard.
  
<h3 id="structure">4. Structure of samples</h3>

All the following are sample projects show use cases with polymer and can be run in the browser, when served by (e.g.) the local-web-server.

```
cd /path-to-project
ws -p 8080
open page in browser on localhost:8080
```
Following samples in the polymer starter kit, folder structure in the samples is as following:

```
|- bower_components  
|  bower.json        // bower dependencies  
|  polymer.json      // application properties PRPL iinfo, here only lint info  
|  manifest.json     // application info
|- src  
    | - data   // further data   
    | - css    // further css  
    | - fonts  // further fonts  
    | - further folders  
    index1.html     // application entry point  
    customElement.html  // polymer element  
    customElement.js    // polymer element

```

<h3 id="htmlusingpoly">5. Basic usage of polymer elements and templates</h3>

In two folders html-use-polymer-element, html-use-polymer-template the use
of polymer elements and templates is shown. Usings polymer templates enables
the use of data-bindings between elements, even outside of polymer elements.
Components can be connected over data flow, HTML elements can be bound to
template data and polymer output elements.

-  polymer element: html-use-polymer-element:   
   -  set and get data from a polymer element using dom events
   +  use of data flow between polymer element and host   
- polymer template: html-use-polymer-template:    
   - use polymer data flow in template
   - input elements with in and out data flow
   - sample with dom-repeat template
 
```
cd /html-use-polymer-element  or
cd /html-use-polymer-template
ws -p 8080
```

  - html-use-polymer-element

In this folder in two samples the use of a polymer element is shown. In one case the polymer element communicates only using using dom events. In the other sample an output of a html element is bound to the output of the polymer multiplier.

```
    <template>
       <poly-multiply id="pelement" out1="{{sum}}"></poly-multiply>
       <h4>out value in data binding: {{sum}}</h4>  
    </template>
```
  - html-use-polymer-template:  

In these sampled the use of a template and data flow usage outside of a polymer element is shown.  

1. The value injected into the template is shown in a HTML element boud to the injected value.  (inject-value.html)
2. Data inputs of polymer paper elements are bound to template data.   (input-polymer.html)
3. sample of data flow with HTML5 input elements is shown in the demo samples of the iron-input element.     
```
    bower_components/iron_input/demo/index1.html  (being served by the static web server as well.)
``` 
4. JSON data is read from a file through the iron.ajax element and the list is displayed using the dom repeat template. (show-list.html)
  
  
<h3 id="appsandpages">6. Polymer pages and applications</h3>

```
cd /poly-app-and-pages
ws -p 8080    //    entry point: src/poly-page1-html, src/polypage2.html
```
  
Here a sample page/application without routing is build. It is used a wamp-data-provider, two different list views,
two tables aggregating the list view and the data provider and two sample page-elements and pages. The pages are using application sample templates from the polymer app-layout element. We differentiate between pages and page element, in order to reuse the page element in the onsen UI samples. This leads to the following structure of polymer elements used in a page: 
  
  
```
page <-- instantiates page element (in the DOM)
page-elementX <-- Local DOM <-- instantieted content(tablex) and layout elements
tableX <-- Local DOM <-- instantiated listViewX and wamp data provider (Data Flow from data provider to view)
listViewX <-- Local DOM <-- instantiatesd elements to realize listView
wamp-data-provider <-- Local DOM  <-- access to wamp protocol service

```
  
All elements are very basic an show the use and decomposition of an page/application using polymer. What is missing so far is the routing of pages. Thes can be done using the sample from the polymer starter Kit (see chapter 8) or using the sample templates of the onsen UI introduction, using the routing elements of the Onsen UI.
  
 
<h3 id="usingcss">7. Using css libs in Polymer</h3>

```
cd /poly-app-from-element-css
ws -p 8080  // entry point: src/bootstrap.html, src/bulma.html
```
This is a sample of using a css library (e.g. bootstrap, bulma) in a polymer element. The bootstrap,bulma css definitions are wrapped in a polymer style module and used as style definitions in the local DOM of the polymer element.
```
  <style include="my-bootstrap">
```
bootstrap is an old and popular css library with some logic given in jquery, bulma a new modern pure css lib, with no further logic provided. Pure css libs like bulma, topcoat are a better match for polymer and mobile or automotive frameworks. Further work would be nesessary to run boostrap in private dom, which is not the case in the sample.
```
   // private dom switched off
   _attachDom(dom) {
       this.appendChild(dom);
    }
```
  
<h3 id="routing">8. Routing sample with polymer</h3>

This sample is not include here but available as part of the polymer starter KIT. To get the sample install polymer-cli (see above)
then start polymmer init:

``` 
polymer init
  --> select starter kit "application template, with navigation and "PRPL pattern" loading". (no 6 in polymer2)
cd /containing Folder
ws -p 8080    //  entry point: index.html
```
The application consists of five HTML pages, which can be selected in a main screen. The pages can be changed by selecting an entry in the side drawer.  

This application is also a sample of the use of the suggested PRPL pattern for progressive web apps.

```
https://www.polymer-project.org/2.0/toolbox/prpl
```

