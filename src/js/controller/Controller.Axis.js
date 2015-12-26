Controller.Axis = function (settings) {

    Controller.Element.call(this, settings);

};

Controller.Axis.prototype = Object.create(Controller.Element.prototype);

Controller.Axis.prototype.init = function() {

    Controller.Element.prototype.init.call(this);

    this.object.interactive = true;

    this.object.mousedown = this.object.touchstart = function (data) {
        this.dragging = true;
        data.target.children[0].position.x = data.data.global.x - data.target.position.x;
        data.target.children[0].position.y = data.data.global.y - data.target.position.y;
    };
    this.object.mouseup = this.object.mouseupoutside = this.object.touchend = this.object.touchendoutside = function(data)
    {
        this.dragging = false;
        data.target.children[0].position.x = 0;
        data.target.children[0].position.y = 0;
    };
    this.object.mousemove = this.object.touchmove = function (data) {
        if (this.dragging) {
            var xPos = data.data.global.x - data.target.position.x;
            if (xPos > -(data.target.width/2) && xPos < data.target.width/2) {
                data.target.children[0].position.x = xPos;
            }
            var yPos = data.data.global.y - data.target.position.y;
            if (yPos > -(data.target.height/2) && yPos < data.target.height/2) {
                data.target.children[0].position.y = yPos;
            }
        }
    };
    this.object.on('mousedown', this.element.onButtonDown);
    this.object.on('touchstart', this.element.onButtonDown);

    this.object.on('mouseup', this.element.onButtonUp);
    this.object.on('touchend', this.element.onButtonUp);
    this.object.on('mouseupoutside', this.element.onButtonUp);
    this.object.on('touchendoutside', this.element.onButtonUp);

    this.object.tap = null;
    this.object.click = null;

    var pad = new PIXI.Sprite(PIXI.loader.resources['img/controller/thumbstick.png'].texture);
    pad.anchor.x = pad.anchor.y = .5;
    this.object.addChild(pad);

};

Controller.Axis.prototype.onButtonDown = function() {

    console.log('button down');

};

Controller.Axis.prototype.onButtonUp = function() {

    console.log('button up');

};