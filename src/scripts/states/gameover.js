'use strict';

var HighScore = require('../highscore');

var gameOver = function(game) {};

gameOver.prototype = gameOverState();

function gameOverState() {
    return {
        preload: preload,
        create: create,
        init: init
    };

    function preload() {
        this.game.load.bitmapFont('scoreFont', 'assets/fonts/bitmapFonts/carrier_command.png', 'assets/fonts/bitmapFonts/carrier_command.xml');
    }

    function init(state){
        this.score = state.score;
        HighScore.setIfHighScore(this.game._my_world.score);
    }

    function create() {
        this.game.add.bitmapText(this.game.world.centerX - 200, this.game.world.centerY-100, 'scoreFont', 'Game Over', 12);
        this.game.add.bitmapText(this.game.world.centerX - 200, this.game.world.centerY-80, 'scoreFont', 'Press space to start again', 12);

        // TODO - tony - temporal approach
        var scoreText = "Score: " + this.game._my_world.score;
        var highScoreText = "Your HighScore: " + HighScore.get();
        this.game.add.bitmapText(this.game.world.centerX - 200, this.game.world.centerY-60, 'scoreFont', scoreText, 12);
        this.game.add.bitmapText(this.game.world.centerX - 200, this.game.world.centerY-40, 'scoreFont', highScoreText, 12);

        var spaceBarKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceBarKey.onDown.add(startGame, this);

        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

        this.input.onDown.add(startGame, this);
        this.game.stage.backgroundColor = '#000';
    }

    function startGame() {
        this.game.state.start('play');
    }
}

module.exports = gameOver;
