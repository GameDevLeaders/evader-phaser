'use strict';

var HighScore = require('../highscore');

var gameOver = function (game) {
};

var background,
    princess;

gameOver.prototype = gameOverState();

function gameOverState() {
    return {
        preload: preload,
        create: create,
        update: update,
        init: init
    };

    function preload() {
        // This should be empty. To load something please use preloader.js
    }

    function init(state) {
        this.score = state.score;
        HighScore.setIfHighScore(this.game._my_world.score);
    }

    function create() {
        var scoreText = "Your score: " + this.game._my_world.score;
        var highScoreText = "Highest score: " + HighScore.get();

        background = this.game.add.tileSprite(0, 0, this.game.stage.width, this.game.cache.getImage('sky').height, 'sky');

        princess = this.game.add.sprite(this.world.centerX - 110, this.game.height - 200, 'princesssurprise');
        princess.scale.set(1.2, 1.2);

        var tweenPrincess = this.game.add.tween(princess).to({x: princess.position.x + 100}, 4000, Phaser.Easing.Quadratic.InOut, true, 0, 1, true);
        tweenPrincess.repeat();

        this.game.add.bitmapText(this.game.world.centerX - 155, this.game.world.centerY - 200, 'scoreFont', 'Game Over', 30);
        this.game.add.bitmapText(this.game.world.centerX - 110, this.game.world.centerY - 80, 'scoreFont', scoreText, 14);
        this.game.add.bitmapText(this.game.world.centerX - 150, this.game.world.centerY - 60, 'scoreFont', highScoreText, 14);
        this.game.add.bitmapText(this.game.world.centerX - 150, this.game.world.centerY - 20, 'scoreFont', 'Tap to start again', 14);


        var spaceBarKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceBarKey.onDown.add(startGame, this);

        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

        this.input.onDown.add(startGame, this);
        this.game.stage.backgroundColor = '#000';
    }

    function update() {
        background.tilePosition.y -= 15;
    }

    function startGame() {
        this.game.state.start('play');
    }
}

module.exports = gameOver;
