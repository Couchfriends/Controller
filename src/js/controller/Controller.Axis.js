Controller.Axis = function (settings) {

    Controller.Element.call(this, settings);

    this.data = {
        x: 0,
        y: 0
    };
    /**
     *
     * @type {number} one percent for calculating the data to send
     * @private
     */
    this._onePercent = 1;

    this.dragging = false;
    this.touchIdentifier = -1;

};

Controller.Axis.prototype = Object.create(Controller.Element.prototype);

Controller.Axis.prototype.init = function() {

    Controller.Element.prototype.init.call(this);

    this.object.interactive = true;


    this.object.on('mousedown', this.onButtonDown.bind(this));
    this.object.on('touchstart', this.onButtonDown.bind(this));

    this.object.on('mouseup', this.onButtonUp.bind(this));
    this.object.on('touchend', this.onButtonUp.bind(this));
    this.object.on('mouseupoutside', this.onButtonUp.bind(this));
    this.object.on('touchendoutside', this.onButtonUp.bind(this));

    this.object.on('mousemove', this.onButtonMove.bind(this));
    this.object.on('touchmove', this.onButtonMove.bind(this));

    var pad = new PIXI.Sprite(PIXI.loader.resources['img/controller/thumbstick.png'].texture);
    pad.anchor.x = pad.anchor.y = .5;
    this.object.addChild(pad);
    this._onePercent = 100 / (this.object.width / 2);

};

Controller.Axis.prototype.onButtonDown = function(data) {
    this.touchIdentifier = data.data.identifier;
    this.dragging = true;
    data.target.children[0].position.x = data.data.global.x - data.target.position.x;
    data.target.children[0].position.y = data.data.global.y - data.target.position.y;
};

Controller.Axis.prototype.onButtonUp = function(data) {
    if (this.touchIdentifier != data.data.identifier) {
        return;
    }
    this.dragging = false;
    this.touchIdentifier = -1;
    data.target.children[0].position.x = 0;
    data.target.children[0].position.y = 0;
    var dataToSend = {
        x: 0,
        y: 0
    };
    this.send(dataToSend);
};

Controller.Axis.prototype.onButtonMove = function(data) {
    if (this.dragging && this.touchIdentifier == data.data.identifier) {
        var dataToSend = {
            x: this.data.x,
            y: this.data.y
        };
        var xPos = data.data.global.x - data.target.position.x;
        if (xPos > -(data.target.width/2) && xPos < data.target.width/2) {
            data.target.children[0].position.x = xPos;
            dataToSend.x = xPos * this._onePercent / 100;
        }
        var yPos = data.data.global.y - data.target.position.y;
        if (yPos > -(data.target.height/2) && yPos < data.target.height/2) {
            data.target.children[0].position.y = yPos;
            dataToSend.y = yPos * this._onePercent / 100;
        }
        this.send(dataToSend);
    }
};

Controller.Axis.prototype.send = function(data) {

    data.x = Math.round(data.x * 100) / 100;
    data.y = Math.round(data.y * 100) / 100;
    if (data.x == this.data.x && data.y == this.data.y) {
        return;
    }
    this.data.x = data.x;
    this.data.y = data.y;
    var jsonData = {
        topic: 'player.orientation',
        data: data
    };
    Controller.Element.prototype.send.call(this, jsonData);

};