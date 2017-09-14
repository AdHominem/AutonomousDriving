
  (function() {
  
  var counter=0;
  class polyApp extends Polymer.Element {
      static get is() { return 'polymer-data-provider'; }
      static get properties() {
        return {
         
        model: {
           type: Object,
           value: {},
           notify: true
          }
        }
      }
      constructor() {
            super();
            counter++;
            console.log("constructor called instance", counter);
      }
    }

  window.customElements.define(polyApp.is, polyApp);
})();
  