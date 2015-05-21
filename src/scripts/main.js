'use strict';

var cfg = require('../../config');

var game = new Phaser.Game(cfg);

var play = require('./states/play');
var gameOver = require('./states/gameover');
var bootGame = require('./states/bootGame');

game.state.add('play', play);
game.state.add('gameOver', gameOver);
game.state.add('bootGame', bootGame);
game.state.start('bootGame');