'use strict';

var Company = module.exports = function () {
    Phaser.State.call(this);
};

Company.prototype = Object.create(Phaser.State.prototype);
Company.prototype.constructor = Company;

Company.prototype.create = function () {
    var logo = this.add.sprite(this.world.centerX - 150, this.world.centerY - 150, 'informal-penguins');
    logo.scale.set(.3, .3);
    logo.alpha = 0;

    var spaceBarKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceBarKey.onDown.add(startGame, this);

    this.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
    this.input.onDown.add(startGame, this);

    var enterTween = this.add.tween(logo).to({alpha: 1}, 1000, Phaser.Easing.Quadratic.InOut);
    var exitTween = this.add.tween(logo).to({alpha: 0}, 1000, Phaser.Easing.Quadratic.InOut, false, 1000);

    enterTween.onComplete.add(function () {
        exitTween.start();
    });

    exitTween.onComplete.add(startGame, this);

    enterTween.start();
};

function startGame() {
    this.state.start('bootGame');
}
