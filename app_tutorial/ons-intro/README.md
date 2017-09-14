+ [Polymer routing with onsenUI](#intro)
  - [Polymer and Onsen](#polymeronsen)
  - [Routing samples](#samples)
  

<h2 id="intro">Onsen Routing with polymer</h2>

<h3 id="polymeronsen">1. Polymer and Onsen UI</h3> 
Polymer is a thin layer over on top of web components trying to facilitate the use of the new standards. In addition it includes a data binding framework for connecting model and views as well as different components. It is the base for application frameworks or with emerging web componnets, it can be seen as a web framework by its own.    

Onsen UI is a mobile application framework based on web components. The main feature of mobile frameworks are customized routings and overlays, customized gestures as required for quick navigation on small devices. Onsen UI provides binding to some application frameworks out of the box, but allows the definition of bindings to further application frameworks by users.  

Since Onsen UI and Polymer are both based on web components, it is possible to co use the frameworks, and making mobile elements available or leveraging polymer or polymer pages.  Mixing Polymer and Onsen UI is more than just mixing web components, since polymer and Onsen UI have some lgic on top of web components, which must be compliant as well. With a HTML5 standard includes finalized, things should get easier here as well.

Short listing of Onsen UI and Polymer features.  

Onsen provides:  
 - global routing elements (splitter navigation)
 - global dialog elements (dialog)
 - global application pages as templates
 - gesture events
 - some further io elements as web components (without shadow dom)
 - page life cycle
 - no data binding
 - explicit bindings to application frameworks, (some out of the box)
  
  
Polymer provides:  
 - a wrapper for for the web component standard
         (shadow dom, templates, custom elements, includes)
 - data binding system tobe used within and between components
 - observer pattern
 - component life cycle
 - rich and growing set of web components (www.webcomponents.org)
         (normally using shadow don and data binding)
 - event system
 - shadow dom styling
 - complete toolbox
 - support for progressive web apps
  
The approach of mixing polymer and onsen UI is to use onsen elements for dialogs, routing, and the definition of pages. Polymer is used to define the content of pages. On the other hand no routing and dialogs are done by polymer elements and no content is displayed by Onsen elements. This is not really a big loss, since a mobile specific routing does not exist otherwise as a polymer or web component, and the polymer framework and elements are much richer for displaying content than onsen UI elements.  
  
<h3 id="samples">2. Routing samples</h3> 
  
Onsen elements are DOM elements, and thus available in the global Name Space. Polymer elements are located in the shadow do of an encapsulating element, unless the element is instantiated in the global DOM itsself.   
  
The approach of mixing OnsenUI and polymer is experimental, and works if done as suggested in the application templates. A proper soltution would be writing polymer bindings for Onsen UI as described in the Onsen UI documentation. In this approach the onsen library is included in the starting page by instantiating all Onsen elements and polymer page elements. All other polymer content elements are instantiated in the local DOM of other elements. This approach enforces a clear separation between onsen routing and dialogs on one side and polymer content on the other side. The Onsen library is used as described in the OnsenUI documentation for Javascript, this usage is not descibed here.  
  
In the following samples Polymer pages are defined as polymer elements. Onsen Pages and Routing and Dialog elements are defined in the DOM and global namespace. The content of an Onsen page is an instantiated Polymer element of a polymer page.  
  
```
  DOM   <--  Onsen Router
  DOM   <--  Onsen Dialog
  DOM   <--  Onsen Page <-- Instantiated Polymer page element
  DOM   <--  Onsen Dialog <-- Polymer elements (composites)
  Polymer Page Element <--  Local DOM  <-- further Polymer elements (Page content)
  Polymer element <-- Local DOM <-- further Polymer elements (Page content)
```
  
The samples aplication templates in the onsen-intro have the following structure:  
  
```
ons-intro:   
| -   bower_components   ----   used bower components
| -   demo               ----   demo helper for generation of sample content
| -   src
| -      html            ----     polymer page elements (from poly-intro)
| -   ons-poly-appnav-one-page1.html    ----   sample ons Router
| -   ons-poly-appnav-carousel.html     ----   sample ons Router
|     ....
```  
  
The following application sample templates exist:
  
```
ons-poly-appnav-one-pageX.html: display one polymer page
ons-poly-apptab.html:           onsen tabbar router using polymer pages  
ons-poly-appsplitter.html:      onsen sidebar router using polymer pages
ons-poly-appnav.html:           onsen navigator using polymer pages
ons-poly-dialog.html:           onsen dialog using polymer pages and elements
ons-poly-carousel.html:         onsen carousel using polymer pages
```
  
The samples can be executed by running a static web server in the ons-intro folder and 
accessing the file from the browser: 
  
```
cd /ons.intro
ws -p 8080      // start static file server (here web server from node repository)
open page in browser on localhost:8080
```
  