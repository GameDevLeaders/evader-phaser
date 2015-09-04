'use strict';

var cfg = require('../../../config');
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

        var retryControlsX = this.world.centerX - 75;
        var retryControlsY = this.world.centerY - 50;

        var retryButton = this.game.add.sprite(retryControlsX, retryControlsY, 'retryButton');
        retryButton.scale.set(2.9, 2.5);
        retryButton.inputEnabled = true;
        retryButton.input.useHandCursor = true;
        retryButton.events.onInputDown.add(startGame, this);

        var fbButton = this.game.add.sprite(retryControlsX, retryControlsY + 80, 'fbButton');
        fbButton.scale.set(2.5);
        fbButton.inputEnabled = true;
        fbButton.input.useHandCursor = true;
        fbButton.events.onInputDown.add(shareOnFb, this);

        var twButton = this.game.add.sprite(retryControlsX + 80, retryControlsY + 80, 'twButton');
        twButton.scale.set(2.5);
        twButton.inputEnabled = true;
        twButton.input.useHandCursor = true;
        twButton.events.onInputDown.add(shareOnTw, this);

        princess = this.game.add.sprite(this.world.centerX - 110, this.game.height - 200, 'princesssurprise');
        princess.scale.set(1.2, 1.2);

        var tweenPrincess = this.game.add.tween(princess).to({x: princess.position.x + 100}, 4000, Phaser.Easing.Quadratic.InOut, true, 0, 1, true);
        tweenPrincess.repeat();

        this.game.add.bitmapText(this.game.world.centerX - 155, this.game.world.centerY - 200, 'scoreFont', 'Game Over', 30);
        this.game.add.bitmapText(this.game.world.centerX - 110, this.game.world.centerY - 120, 'scoreFont', scoreText, 14);
        this.game.add.bitmapText(this.game.world.centerX - 150, this.game.world.centerY - 100, 'scoreFont', highScoreText, 14);

        this.game.stage.backgroundColor = '#000';
    }

    function update() {
        background.tilePosition.y -= 15;
    }

    function startGame() {
        this.game.state.start('play');
    }

    function shareOnFb() {
        var url = 'https://www.facebook.com/dialog/feed?';
        var app_id = cfg.app_id;
        var caption = 'I just scored ' + this.game._my_world.score + '!';
        var link = cfg.canonical_url;

        var params = 'app_id=' + app_id +
            '&display=popup' +
            '&caption=' + encodeURIComponent(caption) +
            '&link=' + link +
            '&redirect_uri=' + link;

        window.open(url + params, '_blank');
    }

    function shareOnTw() {
        var url = 'http://twitter.com/home?';
        var status = 'I scored ' + this.game._my_world.score + ' at #rocketPrincess - ' + cfg.canonical_url;

        var params = 'status=' + encodeURIComponent(status);

        window.open(url + params, '_blank');
    }
}

module.exports = gameOver;
