'use strict';

var cfg = require('../../config');

var game = new Phaser.Game(cfg);

var boot = require('./states/boot');
var preloader = require('./states/preloader');
var company = require('./states/company');
var play = require('./states/play');
var gameOver = require('./states/gameover');
var bootGame = require('./states/bootGame');
var intro = require('./states/intro');

game.state.add('boot', boot);
game.state.add('preloader', preloader);
game.state.add('company', company);
game.state.add('play', play);
game.state.add('gameOver', gameOver);
game.state.add('bootGame', bootGame);
game.state.add('intro', intro);

game.state.start('boot');
