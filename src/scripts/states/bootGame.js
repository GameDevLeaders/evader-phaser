'use strict';

var bootGame = function(game) {};

bootGame.prototype = bootGameState();

function bootGameState() {
    return {
        create: create
    };

    function create() {
        var style = { font: "15px Arial", fill: "#00ff00", align: "center" };
        var text = this.game.add.text(
            this.game.world.centerX,
            this.game.world.centerY,
            "Welcome!!\nClick to start playing",
            style
        );

        text.anchor.set(0.5);
        this.input.onDown.add(startGame, this);
    }

    function startGame() {
        this.game.state.start('play');
    }
}

module.exports = bootGame;
