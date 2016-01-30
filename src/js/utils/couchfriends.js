/**
 * component/emitter
 *
 * Copyright (c) 2014 Component contributors <dev@component.io>
 */
function Emitter(t) {
    return t ? mixin(t) : void 0
}
function mixin(t) {
    for (var e in Emitter.prototype)t[e] = Emitter.prototype[e];
    return t
}
Emitter.prototype.on = Emitter.prototype.addEventListener = function (t, e) {
    return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), this
}, Emitter.prototype.once = function (t, e) {
    function i() {
        this.off(t, i), e.apply(this, arguments)
    }

    return i.fn = e, this.on(t, i), this
}, Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (t, e) {
    if (this._callbacks = this._callbacks || {}, 0 == arguments.length)return this._callbacks = {}, this;
    var i = this._callbacks["$" + t];
    if (!i)return this;
    if (1 == arguments.length)return delete this._callbacks["$" + t], this;
    for (var r, s = 0; s < i.length; s++)if (r = i[s], r === e || r.fn === e) {
        i.splice(s, 1);
        break
    }
    return this
}, Emitter.prototype.emit = function (t) {
    this._callbacks = this._callbacks || {};
    var e = [].slice.call(arguments, 1), i = this._callbacks["$" + t];
    if (i) {
        i = i.slice(0);
        for (var r = 0, s = i.length; s > r; ++r)i[r].apply(this, e)
    }
    return this
}, Emitter.prototype.listeners = function (t) {
    return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || []
}, Emitter.prototype.hasListeners = function (t) {
    return !!this.listeners(t).length
};

var peerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection ||
    window.webkitRTCPeerConnection || window.msRTCPeerConnection;
var sessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription ||
    window.webkitRTCSessionDescription || window.msRTCSessionDescription;
var iceCandidate = window.webkitRTCIceCandidate || window.mozRTCIceCandidate || window.RTCIceCandidate;

var COUCHFRIENDS = {

    settings: {
        peerOffer: {},
        host: 'ws.couchfriends.com',
        port: '80',
        peerConfig: {"iceServers": [{"urls": ["stun:stun.l.google.com:19302"]}]},
        peerConnection: {
            'optional': [{'DtlsSrtpKeyAgreement': true}, {'RtpDataChannels': true}]
        },
        peerDataChannelConfig: {
            ordered: false,
            reliable: false
        },
        sdpConstraints: {
            'offerToReceiveAudio': false,
            'offerToReceiveVideo': false
        },
        // @todo Let player set name and color
        // @todo info needs to come from server, too.
        client: {
            id: 0,
            name: 'New player',
            color: '#ff9900'
        }
    },

    connected: false,
    peerConnected: false,
    socket: {},
    socketPeer: {},

    connect: function () {

        if (typeof WebSocket == 'undefined') {
            COUCHFRIENDS.emit('error', {message: 'Websockets are not supported on this device.'});
        }
        if (this.connected == true) {
            return true;
        }
        this.socket = new WebSocket('wss://' + this.settings.host + ':' + this.settings.port);

        /**
         * Websocket message received. Parse the topic and action parameters and
         * emit the callback related to this event.
         * @param event object the websocket event
         */
        this.socket.onmessage = function (event) {
            var data = JSON.parse(event.data);
            var callback = '';
            if (typeof data.topic == 'string') {
                callback += data.topic;
            }
            if (typeof data.action == 'string') {
                callback += '.' + data.action;
            }

            COUCHFRIENDS.emit(callback, data.data);
            console.log('receiving', callback, data.data);
        };

        COUCHFRIENDS.socket.onopen = function () {
            COUCHFRIENDS.connected = true;
            COUCHFRIENDS.emit('connect');
            COUCHFRIENDS._connectPeersocket();
        };
        COUCHFRIENDS.socket.onclose = function () {
            COUCHFRIENDS.connected = false;
            COUCHFRIENDS.emit('disconnect');
        };
    },

    _connectPeersocket: function () {

        if (typeof peerConnection == 'undefined') {
            COUCHFRIENDS.emit('error', 'Peer connection not available.');
            return false;
        }
        COUCHFRIENDS.socketPeer = new peerConnection(
            COUCHFRIENDS.settings.peerConfig,
            COUCHFRIENDS.settings.peerConnection
        );

        COUCHFRIENDS.peerDataChannel = COUCHFRIENDS.socketPeer.createDataChannel(
            'messages',
            COUCHFRIENDS.settings.peerDataChannelConfig
        );

        COUCHFRIENDS.peerDataChannel.onerror = function (error) {
            COUCHFRIENDS.emit('error', 'Data channel error: ' + error);
        };

        COUCHFRIENDS.peerDataChannel.onmessage = function (event) {
            console.log("Got Data Channel Message:", event);
        };

        COUCHFRIENDS.peerDataChannel.onopen = function () {
            console.log('Peer is open for connections.');
            COUCHFRIENDS.peerConnected = true;
        };

        COUCHFRIENDS.peerDataChannel.onclose = function () {
            console.log('Peer connection closed.');
            //COUCHFRIENDS.peerConnected = false;
        };

        COUCHFRIENDS.socketPeer.ondatachannel = function() {
            console.log('peerConnection.ondatachannel event fired.');
        };

        COUCHFRIENDS.socketPeer.onicecandidate = function (event) {
            if (event.candidate) {
                var jsonData = {
                    // @todo set id parameter here too. Maybe
                    topic: 'player', // @todo make peer
                    action: 'ice',
                    data: JSON.stringify(event.candidate)
                };
                COUCHFRIENDS.send(jsonData);
            }
        };
    },

    send: function (data) {

        if (!this.connected) {
            return;
        }
        if (COUCHFRIENDS.peerConnected == true) {
            console.log('sending through peer.', data);
            // @todo Send id in data too
            data.id =
            COUCHFRIENDS.peerDataChannel.send(JSON.stringify(data));
        }
        else {
            console.log('sending', data);
            COUCHFRIENDS.socket.send(JSON.stringify(data));
        }
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
COUCHFRIENDS.on('connect', function () {
});

/**
 * Callback after the connection is lost from the WebSocket server.
 */
COUCHFRIENDS.on('disconnect', function () {
});


/**
 * Callback after the server started the game and let players allow to join.
 *
 * @param {object} data List with game data
 * @param {string} data.code The game code players need to fill to join this game
 */
COUCHFRIENDS.on('gameStart', function (data) {
    console.log('Game started with code: '+ data.code);
});

COUCHFRIENDS.on('player.call', function (data) {

    console.log('Getting peer call from host.', data);
    var offer = data.peerDescription;
    COUCHFRIENDS.socketPeer.setRemoteDescription(new sessionDescription(offer), function() {
            console.log('Anser fase 1.');
        COUCHFRIENDS.socketPeer.createAnswer(function(answer) {
            console.log('Anser fase 2.', answer);
            COUCHFRIENDS.socketPeer.setLocalDescription(new sessionDescription(answer), function() {
                // send the answer to the remote connection
                console.log('Answered. Send answer.', answer);
                    var jsonData = {
                        topic: 'player',
                        action: 'answer',
                        data: answer
                    };
                COUCHFRIENDS.send(jsonData);
                    //COUCHFRIENDS.peerConnected = true;
            },
            function (error) {
                console.log(error);
            });
        },
        function (error) {
            console.log(error);
        });
    },
    function (error) {
        console.log(error);
    });

});

COUCHFRIENDS.on('player.ice', function (data) {
    console.log('Ice server', data);
    var candidate = JSON.parse(data);
    console.log(candidate);
    COUCHFRIENDS.socketPeer.addIceCandidate(new iceCandidate(candidate));
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
    COUCHFRIENDS.settings.client = data;
});

/**
 * Callback when a host game disconnected from the webserver
 *
 */
COUCHFRIENDS.on('gameDisconnect', function () {
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
COUCHFRIENDS.on('buttonAdd', function (data) {
});

/**
 * Callback when a button should be removed from the interface
 *
 */
COUCHFRIENDS.on('buttonRemove', function (data) {
});

/**
 * Callback when a phone should vibrate
 *
 * Currently only maximum 1000ms supported
 *
 */
COUCHFRIENDS.on('vibrate', function (data) {
    // console.log('Vibrate for: ' + data.duration + 'ms');
});

COUCHFRIENDS.on('achievementUnlock', function (data) {
});
COUCHFRIENDS.on('_achievementUnlock', function (data) {
    COUCHFRIENDS._VARS.sounds.achievement.play();
});