'use strict';

var cfg = require('../../../config');
var Hand = require('../entities/hand');
var bootGame = function(game) {};
var timer = {};
var interval = {};
var background;

bootGame.prototype = bootGameState();

function bootGameState() {
    return {
        create: create,
        preload: preload,
        update: update
    };

    function preload() {
        this.game.load.bitmapFont('scoreFont', 'assets/fonts/bitmapFonts/carrier_command.png', 'assets/fonts/bitmapFonts/carrier_command.xml');
        this.game.load.image('logo', 'assets/logo.png');
        this.game.load.image('hand', 'assets/hand3.png');
        this.game.load.image('instructions', 'assets/instr.png');
        this.game.load.image('sky', 'assets/sprites/sky.png');
    }

    function create() {
        background = this.game.add.tileSprite(0, 0, this.game.stage.width, this.game.cache.getImage('sky').height, 'sky');

        this.game.add.bitmapText(5, this.game.height - 10, 'scoreFont', cfg.version, 8);

        var logo = this.game.add.sprite(this.game.world.centerX - 150, -20, 'logo');
        logo.scale.set(.5,.5);

        var spaceBarKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceBarKey.onDown.add(startGame, this);

        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        this.input.onDown.add(startGame, this);

        var instructions = this.game.add.sprite(this.game.world.centerX - 150, this.game.world.height - 420, 'instructions');

        var hand = new Hand(this.game);

        var tweenHandHorizontalMove = this.game.add.tween(hand).to({ y: hand.position.y - 100 }, 500, Phaser.Easing.Quadratic.InOut, false, 0, 1, true);
        var tweenHandVerticalMove = this.game.add.tween(hand).to({ x: hand.position.x - 100 }, 500, Phaser.Easing.Quadratic.InOut, false, 0, 1, true);
        var tweenHandArbitraryMove = this.game.add.tween(hand).to({
            x: [
                hand.position.x + 200,
                hand.position.x + 80
            ],
            y: [
                hand.position.y + 50,
                hand.position.y - 200
            ]
        }, 2000, Phaser.Easing.Quadratic.InOut);
        tweenHandArbitraryMove.interpolation(Phaser.Math.bezierInterpolation);

        var tweenHandScale = this.game.add.tween(hand.scale).to({ x: 0.11, y: 0.11}, 500, Phaser.Easing.Quadratic.InOut, false, 0, -1, true);

        tweenHandHorizontalMove.onComplete.add(function() {
            tweenHandVerticalMove.onComplete.add(function() {
                tweenHandArbitraryMove.onComplete.add(function() {
                    //tweenHandScale.onLoop.add(function() {
                    //    this.game.add.bitmapText(hand.position.x, hand.position.y - 10, 'scoreFont', 'Tap to start', 10);
                    //}, this);
                    tweenHandScale.start();
                }, this);
                tweenHandArbitraryMove.start();
            }, this);
            tweenHandVerticalMove.start();
        }, this);

        tweenHandHorizontalMove.start();
    }

    function update() {
        background.tilePosition.y -= 0.25;
    }

    function startGame() {
        this.game.state.start('intro');
    }
}

module.exports = bootGame;
