'use strict';

var bootGame = function(game) {};

bootGame.prototype = bootGameState();

function bootGameState() {
    return {
        preload: preload,
        create: create
    };

    function preload() {
        this.game.load.bitmapFont('scoreFont', 'assets/fonts/bitmapFonts/carrier_command.png', 'assets/fonts/bitmapFonts/carrier_command.xml');
        this.game.load.image('logo', 'assets/logo.png');
    }

    function create() {

        this.game.add.bitmapText(this.game.world.centerX - 140, this.game.world.centerY, 'scoreFont', 'Press space...', 12);
        var logo = this.game.add.sprite(0, 0, 'logo');
        logo.scale.set(.5,.5);

        var spaceBarKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceBarKey.onDown.add(startGame, this);

        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        this.input.onDown.add(startGame, this);
    }

    function startGame() {
        this.game.state.start('play');
    }
}

module.exports = bootGame;
