var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.startup, false);
        window.addEventListener('load', this.startup, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    startup: function() {
        app.receivedEvent('deviceready');
        console.log('ready');
        document.getElementById('logo').className = 'animated fadeOut';
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('received', id);
    }
};

app.initialize();