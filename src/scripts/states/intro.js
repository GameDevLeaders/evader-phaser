'use strict';

var intro = function(game) {};
var timer = {};
var interval = {};
var background;

intro.prototype = introState();

function introState () {
	return {
		create: create,
		preload: preload,
		update: update
	};

	function preload() {
		var game = this.game;
		for(var x = 1; x < 601 ; x ++) {
			if(x < 10){
				this.game.load.image('intro' + x, 'assets/intro/intro000' + x + '.png' );
			}
			else if (x >= 10 && x < 100) {
				this.game.load.image('intro' + x, 'assets/intro/intro00' + x + '.png' );
			} 

			else if (x >= 100) {
				this.game.load.image('intro' + x, 'assets/intro/intro0' + x + '.png' );
			} 
			
		}
		
	}

	function create () {
		var frames = [];
		for (var x = 0; x < 600; x ++){
			frames[x] = this.game.add.sprite(this.game.world.centerX - 200, this.game.world.centerY/2, 'intro' + (x + 1));
		}
	}

	function update () {

	}

	function startGame() {
        this.game.state.start('play');
    }


}

module.exports = intro;
