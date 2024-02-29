var COUCHFRIENDS = {
    _socket: {}, // The peer socket
    _socketData: {}, // The data channel
    settings: {
        host: 'ws.couchfriends.com',
        port: 80,
        secure: true
    },
    player: {
        id: 0,
        name: 'New player',
        color: '#ff9900'
    },

    /**
     * Connect the the websocket
     * @return {null|boolean|void}
     */
    connect: function () {

        if (COUCHFRIENDS._socket != null && COUCHFRIENDS._socket.open == true) {
            return false;
        }
        var peer = new Peer({
            // host: COUCHFRIENDS.settings.host,
            // port: COUCHFRIENDS.settings.port,
            // secure: COUCHFRIENDS.settings.secure
        });
        peer.on('open', function (code) {
            COUCHFRIENDS.player.id = code;
            document.getElementById('controller').className = 'animated fadeOut';
            app.UI.showForm();
            document.getElementById('status').innerHTML = 'Connected';
        });
        peer.on('connection', function (conn) {});
        peer.on('close', function (event) {
            document.getElementById('controller').style.display = 'none';
            document.getElementById('controller').className = 'animated fadeOut';
            app.gameConnected = false;
            app.UI.showForm('join');
        });

        COUCHFRIENDS._socket = peer;
    },

    /**
     * Join the a game
     * @param code string the game code
     */
    join: function (code) {
        code = code || document.getElementById('input-code').value;
        code = code.toUpperCase();
        var DataConnection = this._socket.connect(code);
        DataConnection.on('open', function (data) {
            document.getElementById('controller').style.display = 'block';
            document.getElementById('controller').className = 'animated fadeIn';
            document.getElementById('input-code').blur();
            app.gameConnected = true;
            app.UI.showForm();
        });
        DataConnection.on('close', function (data) {
            document.getElementById('controller').style.display = 'none';
            document.getElementById('controller').className = 'animated fadeOut';
            app.gameConnected = false;
            app.UI.showForm('join');
        });
        DataConnection.on('error', function (data) {
            COUCHFRIENDS.emit('error', data);
        });
        DataConnection.on('data', function (data) {
            if (data == null || data.type == null) {
                return;
            }
            var params = {};
            if (data.data != null) {
                params = data.data;
            }
            COUCHFRIENDS.emit(data.type, params);
        });
        COUCHFRIENDS._socketData = DataConnection;
    },

    send: function (data) {

        if (COUCHFRIENDS._socket.open == false) {
            return false;
        }
        COUCHFRIENDS._socketData.send(data);
    }

};

Emitter(COUCHFRIENDS);

/**
 * Received an error from server or request.
 *
 * @param object data
 * @param string data.message the error message
 *
 * @return void
 */
COUCHFRIENDS.on('error', function (data) {
    console.warn(data);
    if (typeof data == 'string') {
        data = {
            message: data
        };
    }
    console.log('error', data.message);
});

/**
 * Callback after connection to the WebSocket server is successful.
 * Best practise will be hosting a new game after a successful connection.
 */
COUCHFRIENDS.on('connect', function (data) {
});

/**
 * Callback after the connection is lost from the WebSocket server.
 */
COUCHFRIENDS.on('disconnect', function () {
});

/**
 * Callback when a player changed its name or added additional information like selected color.
 *
 * @param {object} data list with the player information
 * @param {int} data.id The unique identifier of the player
 * @param {float} [data.name] The (new) name of the player. See http://couchfriends.com/pages/profile.html for possible
 * @param {string} [data.color] The primary color to identify the player on the screen
 * names and characters that might be included in the name.
 */
COUCHFRIENDS.on('player.identify', function (data) {
    app.setUser(data);
});

/**
 * Callback when a host game disconnected from the webserver
 *
 */
COUCHFRIENDS.on('game.disconnect', function () {
});

/**
 * Callback when a button should be added to the interface
 *
 * @param {object} data list with configs
 * @param {int|string} data.id the unique identifer ot the button
 * @param {string} [data.type] Type of the button. E.g. circle?
 * @param {string} [data.label] The label to be written on the button. e.g. "Shoot!" or "A"
 * @param {string} [data.color] The color in hex of the button. e.g. "#ff9900"
 * @param {object} [data.size] Options for its size
 * @param {string} [data.size.radius] The diameter of the object (used for circles)
 * @param {object} [data.position] The left, right, bottom, top position of the button
 *

 id: 'button',
 type: 'circle',
 label: 'A',
 labelColor: '#ffffff',
 labelFont: 'bold 22px Arial',
 color: '#ff0000',
 size: {
            radius: 32,
            width: 64,
            height: 64
        },
 position: {
            top: '50%',
            left: '50%',
            bottom: '',
            right: ''
        },
 positionAABB: {
            x: 0,
            y: 0
        }
 */
COUCHFRIENDS.on('button.add', function (data) {
});

/**
 * Callback when a button should be removed from the interface
 *
 */
COUCHFRIENDS.on('button.remove', function (data) {
});

/**
 * Callback when a phone should vibrate
 *
 * Currently only maximum 1000ms supported
 *
 */
COUCHFRIENDS.on('vibrate', function (data) {
    // console.log('Vibrate for: ' + data.duration + 'ms');
    if (window.vibrate) {
        window.vibrate(data.duration);
    }
});

COUCHFRIENDS.on('achievement.unlock', function (data) {
    // COUCHFRIENDS._VARS.sounds.achievement.play();
});