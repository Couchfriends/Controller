var Controller = {

    /**
     * Unique id of the elements
     */
    ElementIndex: 1,

    addButtonsABXY: function() {

        this.addButtonA();
        this.addButtonB();
        this.addButtonX();
        this.addButtonY();

    },

    addDpad: function() {
        this.addButtonLeft();
        this.addButtonUp();
        this.addButtonRight();
        this.addButtonDown();
    },

    addAxis: function() {

        var settings = {
            id: 'axis',
            position: {
                left: 16,
                bottom: 16
            },
            texture: PIXI.loader.resources['img/controller/thumbstick-bg.png'].texture
        };
        var button = new Controller.Axis(settings);
        button.init();
        button.add();
    },

    addButtonLeft: function() {

        var settings = {
            id: 'left',
            position: {
                left: 16,
                top: 72
            },
            texture: PIXI.loader.resources['img/controller/button-left.png'].texture
        };
        var button = new Controller.Button(settings);
        button.init();
        button.add();

    },

    addButtonUp: function() {

        var settings = {
            id: 'up',
            position: {
                left: 72,
                top: 16
            },
            texture: PIXI.loader.resources['img/controller/button-up.png'].texture
        };
        var button = new Controller.Button(settings);
        button.init();
        button.add();

    },

    addButtonRight: function() {

        var settings = {
            id: 'right',
            position: {
                left: 128,
                top: 72
            },
            texture: PIXI.loader.resources['img/controller/button-right.png'].texture
        };
        var button = new Controller.Button(settings);
        button.init();
        button.add();

    },

    addButtonDown: function() {

        var settings = {
            id: 'down',
            position: {
                left: 72,
                top: 128
            },
            texture: PIXI.loader.resources['img/controller/button-down.png'].texture
        };
        var button = new Controller.Button(settings);
        button.init();
        button.add();

    },

    addButtonA: function() {

        var settings = {
            id: 'button-a',
            position: {
                right: 72,
                bottom: 16
            },
            texture: PIXI.loader.resources['img/controller/button-a.png'].texture
        };
        var button = new Controller.Button(settings);
        button.init();
        button.add();

    },

    addButtonB: function() {

        var settings = {
            id: 'button-b',
            position: {
                right: 16,
                bottom: 72
            },
            texture: PIXI.loader.resources['img/controller/button-b.png'].texture
        };
        var button = new Controller.Button(settings);
        button.init();
        button.add();

    },

    addButtonX: function() {

        var settings = {
            id: 'button-x',
            position: {
                right: 128,
                bottom: 72
            },
            texture: PIXI.loader.resources['img/controller/button-x.png'].texture
        };
        var button = new Controller.Button(settings);
        button.init();
        button.add();

    },

    addButtonY: function() {

        var settings = {
            id: 'button-y',
            position: {
                right: 72,
                bottom: 128
            },
            texture: PIXI.loader.resources['img/controller/button-y.png'].texture
        };
        var button = new Controller.Button(settings);
        button.init();
        button.add();

    }

};