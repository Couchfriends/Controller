var Controller = {

    /**
     * Unique id of the elements
     */
    ElementIndex: 1,

    /**
     * Calculate the absolute x, y position of an object based on the 'left',
     * 'right', 'top' and 'bottom' position. E.g.
     * left: '50%', top: 16.
     * @param relativePosition Object with relative position.
     * @param relativePosition.left mixed The position seen from the left. e.g.
     * '50%' or 16.
     * @param relativePosition.right mixed The position seen from the right.
     * e.g. '50%' or 16.
     * @param relativePosition.top mixed The position seen from the top. e.g.
     * '50%' or 16.
     * @param relativePosition.bottom mixed The position seen from the bottom.
     * e.g. '50%' or 16.
     *
     * @param objectWidth the full width of the object to be adjusted. If an
     * object is 512px wide and the right position is 16 then it should be
     * positioned 240px from the right view (512/2 -16).
     * @param objectHeight the full height of the object to be adjusted.
     *
     * @return object the absolute x, y position as object. {x: 256, y: 16};
     */
    calculateAbsolutePosition: function (relativePosition, objectWidth, objectHeight) {

        objectWidth = objectWidth || 0;
        objectHeight = objectHeight || 0;
        var settings = app.settings;
        var pos = relativePosition;
        // The new absolute position
        var position = {
            x: 0,
            y: 0
        };

        if (pos.left != null) {
            position.x = parseInt(pos.left);
            if (typeof pos.left == 'string' && pos.indexOf('%') >= 0) {
                position.x = settings.width / 100 * parseInt(pos.left);
            }
            position.x += objectWidth / 2;
        }
        else if (pos.right != null) {
            position.x = settings.width - parseInt(pos.right);
            if (typeof pos.right == 'string' && pos.right.indexOf('%') >= 0) {
                position.x = settings.width - (settings.width / 100 * parseInt(pos.right));
            }
            //
            position.x -= objectWidth / 2;
        }
        if (pos.top != null) {
            position.y = parseInt(pos.top);
            if (typeof pos.top == 'string' && pos.top.indexOf('%') >= 0) {
                position.y = settings.height / 100 * parseInt(pos.top);
            }
            position.y += objectHeight / 2;
        }
        else if (pos.bottom != null) {
            position.y = settings.height - parseInt(pos.bottom);
            if (typeof pos.bottom == 'string' && pos.bottom.indexOf('%') >= 0) {
                position.y = settings.height - (settings.height / 100 * parseInt(pos.bottom));
            }
            position.y -= objectHeight / 2;
        }

        return position;

    },

    addButtonsABXY: function () {
        this.addButtonA();
        this.addButtonB();
        this.addButtonX();
        this.addButtonY();
    },

    addDpad: function () {
        this.addButtonLeft();
        this.addButtonUp();
        this.addButtonRight();
        this.addButtonDown();
    },

    addButtonA: function () {

        var settings = {
            id: 'a',
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

    addButtonB: function () {

        var settings = {
            id: 'b',
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

    addButtonX: function () {

        var settings = {
            id: 'x',
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

    addButtonY: function () {

        var settings = {
            id: 'y',
            position: {
                right: 72,
                bottom: 128
            },
            texture: PIXI.loader.resources['img/controller/button-y.png'].texture
        };
        var button = new Controller.Button(settings);
        button.init();
        button.add();

    },

    addAxis: function () {

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

    addButtonLeft: function () {

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

    addButtonUp: function () {

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

    addButtonRight: function () {

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

    addButtonDown: function () {

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

    }

};