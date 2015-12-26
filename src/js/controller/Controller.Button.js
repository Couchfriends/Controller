Controller.Button = function (settings) {

    Controller.Element.call(this, settings);

};

Controller.Button.prototype = Object.create(Controller.Element.prototype);

Controller.Button.prototype.init = function() {

    Controller.Element.prototype.init.call(this);
    this.object.interactive = true;

};

Controller.Button.prototype.onButtonDown = function() {

    this.send(
        {
            topic: 'interface',
            action: 'buttonDown',
            data: {
                id: this.id
            }
        }
    );

};

Controller.Button.prototype.onButtonUp = function() {

    this.send(
        {
            topic: 'interface',
            action: 'buttonUp',
            data: {
                id: this.id
            }
        }
    );

};