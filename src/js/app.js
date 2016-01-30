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
    gameConnected: false,
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
        host: 'https://couchfriends.com/api/',
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

        try {
            var user = window.localStorage.getItem('user');
            if (user) {
                app.setUser(JSON.parse(user));
            }
        }
        catch (e) {

        }
    },
    start: function () {
        app.receivedEvent('start');
        app.UI.init();
        COUCHFRIENDS.on('connect', function () {
            document.getElementById('controller').className = 'animated fadeOut';
            app.UI.showForm();
            document.getElementById('status').innerHTML = 'Connected';
        });
        COUCHFRIENDS.on('disconnect', function () {
            document.getElementById('controller').className = 'animated fadeOut';
            app.UI.showForm();
            document.getElementById('status').innerHTML = 'Connected';
            app.gameConnected = false;
        });
        COUCHFRIENDS.on('game.start', function () {
            document.getElementById('controller').style.display = 'block';
            document.getElementById('controller').className = 'animated fadeIn';
            app.gameConnected = true;
            app.UI.hideMenu();
            app.UI.showForm('join');
        });
        COUCHFRIENDS.on('gameDisconnect', function () {
            document.getElementById('controller').style.display = 'none';
            document.getElementById('controller').className = 'animated fadeOut';
            app.gameConnected = false;
            app.UI.showForm('join');
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
            topic: 'game',
            action: 'join',
            data: {
                code: app.settings.gameCode
            }
        });
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        //console.log('received', id);
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

    login: function () {
        var email = document.getElementById('login-email').value;
        var password = document.getElementById('login-password').value;
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
                app.UI.showForm('join');
                var user = data.data;
                app.saveUser(user);
                app.setUser(user);
            },
            headers);
    },
    register: function () {
        var name = document.getElementById('register-name').value;
        var email = document.getElementById('register-email').value;
        var password = document.getElementById('register-password').value;
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
                app.UI.showForm('join');
                var user = data.data;
                app.saveUser(user);
                app.setUser(user);
                app.settings.user = user;
            },
            headers
        );
    },
    logout: function () {
        app.saveUser();
        app.setUser();
        app.UI.hideMenu();
    },
    /**
     * Set the user in the app settings variable.
     *
     * @param [user] object An object with user information
     * @param user.token string the string to communicate with the server.
     * @param user.name string the name of the player
     * @param user.color string|int the color of the user. Default 0xffffff
     */
    setUser: function(user) {
        user = user || {};
        app.settings.user = {
            token: user.token || null,
            name: user.name || '',
            color: user.color || 0xffffff
        };
    },
    /**
     * Saves the user in localstorage.
     *
     * @param [user] object
     * @param user.token string the string to communicate with the server.
     * @param user.name string the name of the player
     * @param user.color string|int the color of the user. Default 0xffffff
     */
    saveUser: function(user) {
        user = user || {};
        var saveUser = {
            token: user.token || null,
            name: user.name || '',
            color: user.color || 0xffffff
        };
        try {
            window.localStorage.setItem('user', JSON.stringify(saveUser));
        }
        catch (e) {
            app.error('Cannot save the user.');
        }

    },
    error: function (message) {
        //console.warn(message);
    }
};
app.UI = {
    formNames: [
        'login', 'register', 'join', 'help'
    ],
    menuDisplayed: false,
    init: function () {
        document.getElementById('menu-button').style.display = 'block';
        // Loading logo
        document.getElementById('logo').className = 'animated fadeOut';
        document.getElementById('menu-button').addEventListener('click', app.UI.toggleMenu, false);
    },
    /**
     * Displays a form.
     * @param formType string the type of form to show. E.g. login, register or join
     * (default).
     */
    showForm: function (formType) {
        formType = formType || 'join';
        this.hideMenu();
        if (this.formNames.indexOf(formType) < 0) {
            formType = 'join';
        }
        for (var i = 0; i < this.formNames.length; i++) {
            var formName = this.formNames[i];
            document.getElementById('form-' + formName).className = 'form-container animated slideOutUp';
        }
        if (formType == 'join' && app.gameConnected == true) {

        }
        else {
            var formContainer = document.getElementById('form-' + formType);
            formContainer.className = 'form-container animated slideInDown';
        }
    },
    toggleMenu: function () {
        if (app.UI.menuDisplayed == false) {
            app.UI.showMenu();
        }
        else {
            app.UI.hideMenu();
        }
    },
    showMenu: function () {
        app.UI.menuDisplayed = true;
        var menu = document.getElementById('menu');
        var links = [];
        links.push({
            url: '',
            name: '<img class="logo-menu" src="img/logo-menu.png" />',
            click: 'app.UI.showForm(\'join\');'
        });
        links.push({
            url: '',
            name: 'Play',
            click: 'app.UI.showForm(\'join\');'
        });
        if (app.settings.user.token == null) {
            links.push({
                url: '',
                name: 'Login',
                click: 'app.UI.showForm(\'login\');'
            });
            links.push({
                url: '',
                name: 'Register',
                click: 'app.UI.showForm(\'register\');'
            });
        }
        else {
            links.push({
                url: '',
                name: 'Logout',
                click: 'app.logout();'
            });
        }
        links.push({
            url: '',
            name: 'Help',
            click: 'app.UI.showForm(\'help\');'
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
        menu.className = 'animated slideInDown';
    },
    hideMenu: function () {
        app.UI.menuDisplayed = false;
        var menu = document.getElementById('menu');
        menu.className = 'animated slideOutUp';
    }
};
app.initialize();