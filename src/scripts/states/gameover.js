'use strict';

var gameOver = function(game) {};

gameOver.prototype = gameOverState();

function gameOverState() {
    return {
        create: create,
        init: init,
        scoreText: null,
    };
    function init(state){
        this.score = state.score;
    }
    function create() {
        console.log(this.game.add.text);
        var style = { font: "15px Arial", fill: "#00ff00", align: "center" }, scoreText;
        var text = this.game.add.text(
            this.game.world.centerX,
            this.game.world.centerY + 20,
            "Game Over\nClick to start again...",
            style
        );
        // TODO - tony - temporal approach
        scoreText = "Score: " + this.game._my_world.score;
        this.scoreText = this.game.add.text(
                (this.game.width/2) - (scoreText.length*3),
                this.game.world.centerY - 25,
                scoreText,
                style
            );
        text.anchor.set(0.5);
        this.input.onDown.add(startGame, this);
    }

    function startGame() {
        this.game.state.start('play');
    }
}

module.exports = gameOver;
