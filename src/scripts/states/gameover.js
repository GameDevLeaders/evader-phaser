'use strict';

var gameOver = function(game) {};

gameOver.prototype = gameOverState();

function gameOverState() {
    return {
        create: create
    };

    function create() {
        console.log(this.play);
        var style = { font: "15px Arial", fill: "#00ff00", align: "center" };
        var text = this.game.add.text(
            this.game.world.centerX,
            this.game.world.centerY,
            "Game Over\nClick to start again...",
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
