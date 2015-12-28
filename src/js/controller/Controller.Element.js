Controller.Element = function (settings) {

    this.index = Controller.ElementIndex++;

    /**
     * The unique identifier for this button. Will be send with the callbacks.
     * @type {string}
     */
    this.id = settings.id || '';

    /**
     * Name of the element
     * @type {string}
     */
    this.name = settings.name || '';

    /**
     * Original position of the element. Will be used to calculate after window
     * resize. See @resize
     * @type {{left: number, top: number, right: number, bottom: number}}
     */
    this.position = settings.position || {
            left: null,
            top: null,
            right: null,
            bottom: null
        };

    this.texture = settings.texture || null;

    /**
     * The PIXI.js object. Might be a container with multiple children. Only
     * one level deep.
     * @type {{}}
     */
    this.object = {};

};

Controller.Element.prototype = {

    init: function () {

        if (this.texture) {
            this.object = new PIXI.Sprite(this.texture);
            this.object.anchor.x = this.object.anchor.y = .5;
        }
        else {
            this.object = new PIXI.Container();
            this.object.pivot.x = this.object.pivot.y = .5;
        }
        this.setPosition();
        this.element = this;

    },

    add: function () {

        if (this.object != null) {
            app.stage.addChild(this.object);
        }
        app.elements.push(this);
    },

    remove: function () {

        if (this.object != null) {
            app.stage.removeChild(this.object);
        }
        var indexOf = app.elements.indexOf(this);
        app.elements.splice(indexOf, 1);
    },

    /**
     * Callback after view port is resized or device orientation has changed.
     *
     * this.object.position will be set.
     */
    resize: function () {

        if (this.object == null) {
            return false;
        }
        this.setPosition();

    },

    setTint: function (tint) {

        if (this.object == null) {
            return false;
        }

        tint = tint || 0xffffff;
        tint = tint.replace(/#/, '0x');

        this.object.tint = tint;
        if (this.object.children.length > 0) {
            for (var i = 0; i < this.object.children.length; i++) {
                var child = this.object.children[i];
                child.tint = tint;
            }
        }
    },

    setPosition: function () {

        this.object.position = Controller.calculateAbsolutePosition(this.position, this.object.width, this.object.height);

    },

    send: function (data) {

        COUCHFRIENDS.send(data);
    }

};