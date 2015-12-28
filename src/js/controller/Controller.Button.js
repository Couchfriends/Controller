Controller.Button = function (settings) {

    Controller.Element.call(this, settings);

};

Controller.Button.prototype = Object.create(Controller.Element.prototype);

Controller.Button.prototype.init = function() {

    Controller.Element.prototype.init.call(this);
    this.object.interactive = true;

    this.object.on('mousedown', this.onButtonDown.bind(this));
    this.object.on('touchstart', this.onButtonDown.bind(this));

    this.object.on('mouseup', this.onButtonUp.bind(this));
    this.object.on('touchend', this.onButtonUp.bind(this));
    this.object.on('mouseupoutside', this.onButtonUp.bind(this));
    this.object.on('touchendoutside', this.onButtonUp.bind(this));

};

Controller.Button.prototype.onButtonDown = function(data) {

    this.send(
        {
            topic: 'player',
            action: 'buttonDown',
            data: {
                id: this.id
            }
        }
    );

};

Controller.Button.prototype.onButtonUp = function(data) {

    this.send(
        {
            topic: 'player',
            action: 'buttonUp',
            data: {
                id: this.id
            }
        }
    );

};