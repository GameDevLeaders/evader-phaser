/* global module */
'use strict';

/*
 * Sounds manager
 *
 * Preloads all the sounds
 * TODO: ?Make it load sounds depending on the screen and unload them?
 */

//These were under constants but they cannot be directly loaded from this file ):
//List of asset names for sounds
var sounds = {
    background: "background",
    dies: "dies",
    cheese: "cheese",
    rotten_cheese: "rotten_cheese",
    hit: "hit",
    start: "start"
};

var singleton = null;

var SoundsManager = function (game) {
    if (singleton) {
        return singleton;
    }

    this.game = game;
    this.active = true; // Active by default, should be able to change it from outer screen.

    //Preload sounds
    game.load.audio(sounds.background, 'assets/audio/background_music.mp3');
    game.load.audio(sounds.start, 'assets/audio/start.mp3');
    game.load.audio(sounds.hit, 'assets/audio/hit.wav');
    game.load.audio(sounds.cheese, 'assets/audio/cheese.wav');
    game.load.audio(sounds.dies, 'assets/audio/dies.wav');
    game.load.audio(sounds.rotten_cheese, 'assets/audio/rotten_cheese.mp3');
    //End load assets

    this.soundsAssets = {};
    this.sounds = sounds;
    singleton = this;
};

SoundsManager.prototype.create = function () {
    // Assign the sound to a var
    this.soundsAssets = {
        dies: this.game.add.audio(sounds.dies),
        cheese: this.game.add.audio(sounds.cheese),
        rotten_cheese: this.game.add.audio(sounds.rotten_cheese),
        background: this.game.add.audio(sounds.background),
        hit: this.game.add.audio(sounds.hit)
    };
};

//play: function (marker, position, volume, loop, forceRestart)
SoundsManager.prototype.play = function (key, loop) {
    var sound = this.soundsAssets[key];

    if (this.active && sound) {
        if (loop) {
            sound.play(undefined, undefined, 0.2, true, true);
        } else {
            sound.play();
        }
    }
};

SoundsManager.prototype.stop = function (sound) {
    console.log('stop');
    if (this.soundsAssets.hasOwnProperty(sound)) {
        this.soundsAssets[sound].stop();
    }
};

SoundsManager.prototype.toggle = function (on) {
    this.active = !!on;
};

SoundsManager.prototype.setGame = function (game) {
    this.game = game;
};

//sounds
module.exports = SoundsManager;
