'use strict';

var cfg = require('../../../config'),
    Hand = require('../entities/hand'),
    SoundsManager = require('../sounds'),
    c = require('../constants'),
    bootGame = function(game) {},
    timer = {},
    interval = {},
    background,
    speaker,
    SM;

bootGame.prototype = bootGameState();

function bootGameState() {
    return {
        create: create,
        preload: preload,
        update: update
    };

    function preload() {
        // This should be empty. To load something please use preloader.js
    }

    function create() {

        SM = new SoundsManager(this.game);
        SM.create();
        SM.play(SM.SOUNDS.MENU, true);

        background = this.game.add.tileSprite(0, 0, this.game.stage.width, this.game.cache.getImage('sky').height, 'sky');

        this.game.add.bitmapText(5, this.game.height - 10, 'scoreFont', cfg.version, 8);

        var logo = this.game.add.sprite(this.game.world.centerX - 150, -20, 'logo');
        logo.scale.set(.5,.5);

        var spaceBarKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceBarKey.onDown.add(startGame, this);

        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        this.input.onDown.add(mouseClicked, this);

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


        speaker = this.game.add.sprite(instructions.width + instructions.x + 50, this.game.world.height - 100, c.SPRITES.SPEAKER_ON);
    }
    function mouseClicked(event){
        if(localCollides(event, speaker)){
            toggleSound("boot");
        } else {
            startGame.apply(this);
        }
    }

    function localCollides(event, sprite){
        var x = event.x,
            y = event.y;
        return x >= sprite.x && x <= (sprite.x + sprite.width) && y >= sprite.y && y <= sprite.y + sprite.height;
    }
    function toggleSound(){
        SM.toggle("boot");
        if(SM.isActive()){
            speaker.loadTexture(c.SPRITES.SPEAKER_ON);
        } else {
            speaker.loadTexture(c.SPRITES.SPEAKER_OFF);
        }
    }

    function update() {
        background.tilePosition.y -= 0.25;
    }

    function startGame() {
        SM.stop(SM.SOUNDS.MENU);
        this.game.state.start('intro');
    }
}

module.exports = bootGame;
