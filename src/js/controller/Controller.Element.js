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

        this.object = new PIXI.Sprite(this.texture);
        this.object.anchor.x = this.object.anchor.y = .5;
        this.setPosition();
        this.element = this;

    },

    add: function () {

        if (this.object != null) {
            app.stage.addChild(this.object);
        }
        app.elements.push(this);
    },

    remove: function() {

        if (this.object != null) {
            app.stage.removeChild(this.object);
        }
        var indexOf = app.elements.indexOf(this);
        app.elements.splice(indexOf, 1);
    },

    /**
     * Callback after view port is resized or device orientation has changed.
     *
     * Sets the absolute position seen from left, right, top, bottom settings
     * can be either in percent or in pixels. Position is calculated based on
     * the app.settings variables:
     * this.position object the original position.
     * this.position.left mixed the left position. e.g. 10
     * this.position.top mixed the top position. e.g. '50%'
     * this.position.right mixed the right position. e.g. null
     * this.position.bottom mixed the bottom position. e.g. 20
     *
     * this.object.position will be set.
     */
    resize: function () {

        if (this.object == null) {
            return false;
        }
        this.setPosition();

    },

    setTint: function(tint) {

        if (this.object == null) {
            return false;
        }

        tint = tint || 0xffffff;

        this.object.tint = tint;
        if (this.object.children.length > 0) {
            for (var i = 0; i < this.object.children.length; i++) {
                var child = this.object.children[i];
                child.tint = tint;
            }
        }
    },

    setPosition: function() {

        var settings = app.settings;
        var pos = this.position; // The original relative position

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
            position.x += this.object.width / 2;
        }
        else if (pos.right != null) {
            position.x = settings.width - parseInt(pos.right);
            if (typeof pos.right == 'string' && pos.right.indexOf('%') >= 0) {
                position.x = settings.width - (settings.width / 100 * parseInt(pos.right));
            }
            //
            position.x -= this.object.width / 2;
        }
        if (pos.top != null) {
            position.y = parseInt(pos.top);
            if (typeof pos.top == 'string' && pos.top.indexOf('%') >= 0) {
                position.y = settings.height / 100 * parseInt(pos.top);
            }
            position.y += this.object.height / 2;
        }
        else if (pos.bottom != null) {
            position.y = settings.height - parseInt(pos.bottom);
            if (typeof pos.bottom == 'string' && pos.bottom.indexOf('%') >= 0) {
                position.y = settings.height - (settings.height / 100 * parseInt(pos.bottom));
            }
            position.y -= this.object.height / 2;
        }

        this.object.position = position;

    },

    send: function(data) {

    }

};