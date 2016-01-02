var app = {
        resources: [
            'img/controller/button-a.png',
            'img/controller/button-b.png',
            'img/controller/button-x.png',
            'img/controller/button-y.png',
            'img/controller/button-down.png',
            'img/controller/button-left.png',
            'img/controller/button-right.png',
            'img/controller/button-up.png',
            'img/controller/thumbstick.png',
            'img/controller/thumbstick-bg.png'
        ],
        /**
         * Global app settings
         */
        settings: {
            /**
             * @param int The width and height of the window/app. Will be changed on
             * window resize.
             */
            width: window.innerWidth,
            height: window.innerHeight,
            gameCode: '',
            host: 'http://localhost/couchfriends/api/',
            user: {
                token: null,
                name: '',
                color: 0xffffff
            }
        },
        /**
         * PIXI stage
         */
        stage: {},
        /**
         * PIXI renderer
         */
        renderer: {},
        /**
         * List with all buttons and ui that can be animated
         */
        elements: [],
        // Application Constructor
        initialize: function () {
            this.bindEvents();
        },
        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function () {
            document.addEventListener('deviceready', app.startup, false);
            window.addEventListener('load', app.startup, false);
            window.addEventListener('resize', app.resize, false);
        },
        // deviceready Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedEvent'
        // function, we must explicitly call 'app.receivedEvent(...);'
        startup: function () {
            app.receivedEvent('deviceready');
            document.getElementById('menu-button').addEventListener('click', app.toggleMenu, false);

            var renderer = PIXI.autoDetectRenderer(
                app.settings.width,
                app.settings.height,
                {
                    transparent: true
                }
            );
            renderer.view.id = 'controller';
            renderer.view.style.display = 'none';
            document.body.appendChild(renderer.view);
            app.renderer = renderer;
            var stage = new PIXI.Container();
            app.stage = stage;

            var resources = app.resources;
            for (var i = 0; i < resources.length; i++) {
                var resource = resources[i];
                PIXI.loader.add(resource);
            }
            PIXI.loader.on('complete', app.start);
            PIXI.loader.load();
        },
        start: function () {
            app.receivedEvent('start');
            document.getElementById('menu-button').style.display = 'block';
            document.getElementById('logo').className = 'animated fadeOut';
            COUCHFRIENDS.on('connect', function () {
                document.getElementById('form-connect').style.display = 'block';
                document.getElementById('controller').className = 'animated fadeOut';
                document.getElementById('form-connect').className = 'animated fadeIn';
                document.getElementById('status').innerHTML = 'Connected';
            });
            COUCHFRIENDS.on('disconnect', function () {
                document.getElementById('controller').className = 'animated fadeOut';
                document.getElementById('form-connect').className = 'animated fadeIn';
                document.getElementById('status').innerHTML = 'Connected';
            });
            COUCHFRIENDS.on('gameStart', function () {
                document.getElementById('controller').style.display = 'block';
                document.getElementById('controller').className = 'animated fadeIn';
                document.getElementById('form-connect').className = 'animated fadeOut';
            });
            COUCHFRIENDS.on('gameDisconnect', function () {
                document.getElementById('controller').style.display = 'none';
                document.getElementById('controller').className = 'animated fadeOut';
                document.getElementById('form-connect').className = 'animated fadeIn';
            });
            COUCHFRIENDS.on('playerIdentify', function (data) {
                app.identify(data);
            });
            app.render();
            COUCHFRIENDS.connect();
            Controller.addButtonsABXY();
            Controller.addAxis();
        },
        joinGame: function (code) {
            code = code || document.getElementById('input-code').value;
            if (code && code != '') {
                app.settings.gameCode = code.toUpperCase();
            }
            if (!COUCHFRIENDS.connected) {
                COUCHFRIENDS.connect();
                COUCHFRIENDS.emit('error', {message: 'Not connected, check your internet and try again.'});
                return false;
            }
            COUCHFRIENDS.send({
                topic: 'player',
                action: 'join',
                data: {
                    code: app.settings.gameCode
                }
            });
        },
        // Update DOM on a Received Event
        receivedEvent: function (id) {
            console.log('received', id);
        },

        /**
         * Window is resized or the screen is rotated. Reposition the buttons and
         * fill the canvas to 100%
         */
        resize: function () {
            var controllerCanvas = document.getElementById('controller');
            if (controllerCanvas == null) {
                return false;
            }
            var w = window.innerWidth;
            var h = window.innerHeight;
            app.settings.width = w;
            app.settings.height = h;
            app.renderer.resize(w, h);

            for (var i = 0; i < app.elements.length; i++) {
                var element = app.elements[i];
                element.resize();
            }

            return true;
        },

        /**
         * Player identifier
         * @param data
         */
        identify: function (data) {

            data = data || {};
            if (data.color != null) {
                for (var i = 0; i < app.elements.length; i++) {
                    var element = app.elements[i];
                    element.setTint(data.color);
                }
            }
        },

        render: function () {
            requestAnimationFrame(app.render);
            if (!COUCHFRIENDS.connected) {
                return;
            }
            app.renderer.render(app.stage);
        },

        /**
         * Displays/Hides the menu and add links in the menu
         */
        toggleMenu: function () {
            var menu = document.getElementById('menu');
            var links = [];
            var display = 'none';
            links.push({url: './', name: '<img src="img/logo-menu.png" />'});
            if (menu.offsetParent == null) {
                display = 'block';
                if (app.settings.user.token == null) {
                    links.push({
                        url: '',
                        name: 'Login',
                        click: 'app.toggleLoginForm();'
                    });
                    links.push({
                        url: '',
                        name: 'Register',
                        click: 'app.toggleRegisterForm();'
                    });
                }
                else {
                    links.push({
                        url: '',
                        name: 'Logout',
                        click: 'app.logout();'
                    });
                }
            }
            links.push({
                url: 'http://www.couchfriends.com/pages/what-is-couchfriends',
                name: 'Help',
                target: '_blank'
            });
            var linksHtml = '';
            for (var i = 0; i < links.length; i++) {
                var link = links[i];
                linksHtml += '<a';
                if (link.url && link.url != '') {
                    linksHtml += ' href="' + link.url + '"';
                }
                if (link.click && link.click != '') {
                    linksHtml += ' onclick="' + link.click + '"';
                }
                if (link.target && link.target != '') {
                    linksHtml += ' target="' + link.target + '"';
                }
                linksHtml += '>' + link.name + '</a>';
            }
            document.getElementById('menu-links').innerHTML = linksHtml;
            menu.style.display = display;
        },
        toggleLoginForm: function () {
            var loginForm = document.getElementById('form-login');
            app.hideMenu();
            app.hideRegister();
            if (loginForm.offsetParent == null) {
                loginForm.style.display = 'block';
            }
            else {
                app.hideLogin();
            }
        },
        toggleRegisterForm: function () {
            var registerForm = document.getElementById('form-register');
            app.hideMenu();
            app.hideLogin();
            if (registerForm.offsetParent == null) {
                registerForm.style.display = 'block';
            }
            else {
                app.hideRegister();
            }
        },
        hideLogin: function () {
            document.getElementById('form-login').style.display = 'none';
        },
        hideRegister: function () {
            document.getElementById('form-register').style.display = 'none';
        },
        hideMenu: function () {
            document.getElementById('menu').style.display = 'none';
        },
        login: function () {
            var email = document.getElementById('input-login-email').value;
            var password = document.getElementById('input-login-password').value;
            var urlLogin = app.settings.host;
            urlLogin += 'users/token';
            var data = {
                "email": email,
                "password": password
            };
            var headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            ajax(urlLogin, JSON.stringify(data), function (data) {
                    data = JSON.parse(data);
                    if (!data.success) {
                        return app.error(data.data.message);
                    }
                    app.hideLogin();
                    app.settings.user = data.data;
                },
                headers);
        },
        register: function () {
            var name = document.getElementById('input-register-name').value;
            var email = document.getElementById('input-register-email').value;
            var password = document.getElementById('input-register-password').value;
            var urlRegister = app.settings.host;
            urlRegister += 'users/add';
            var data = {
                "profile": {
                    "name": name
                },
                "email": email,
                "password": password
            };
            var headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            ajax(urlRegister, JSON.stringify(data), function (data) {
                    data = JSON.parse(data);
                    if (!data.success) {
                        return app.error(data.data.message);
                    }
                    app.hideRegister();
                    app.settings.user = data.data;
                },
                headers);
        },
        logout: function () {
            app.hideMenu();
            app.settings.user.token = null;
        }
        ,
        error: function (message) {
            console.warn(message);
        }
    }
    ;

app.initialize();