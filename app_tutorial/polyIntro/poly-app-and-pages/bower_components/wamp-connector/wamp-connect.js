(function() {
  var _instances = [];
  var _connection=null;
  var _session=null;
  
  var _wsuri = "ws://127.0.0.1:8086/ws";
  _connection = new autobahn.Connection({
            url: _wsuri,
            realm: "realm1"
  });

  // wamp connect
  _connection.onopen = function (session, details) {

          console.log("Connected", _instances);
          _session=session;
          _instances.forEach(function(item) {
                  console.log("WWWWW",item);
                  item.set('session', _session);
          });
   
  }

  _connection.open();

  class WConnect extends Polymer.Element {
      static get is() { return 'wamp-connect'; }
      static get properties() {
        return {
       /**
         * the wamp session returned by connect call
         * @type {Object}
        */
        session: {
           type: Object,
           notify: true,
           value:null,
        }

       };
      }
      constructor() {
        super();
        if (_session!==null)  {
           this.session=_session;
        }  
        _instances.push(this); 
      }
    }

    window.customElements.define(WConnect.is, WConnect);
})();
  