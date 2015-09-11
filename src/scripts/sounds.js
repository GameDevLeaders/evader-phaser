/* global module */
'use strict';

/*
 * Sounds manager
 *
 * Preloads all the sounds
 * TODO: ?Make it load sounds depending on the screen and unload them?
 */

// These were under constants but they cannot be directly loaded from this file ):
// List of asset names for sounds
var c = require('./constants');
var SOUNDS = c.SOUNDS;

var singleton = null;

var SoundsManager = function (game) {
    if (singleton) {
        return singleton;
    }

    this.game = game;
    this.active = true; // Active by default, should be able to change it from outer screen.

    this.soundsAssets = {};
    this.SOUNDS = SOUNDS;
    singleton = this;
};

SoundsManager.prototype.create = function () {
    // Assign the sound to a var
    this.soundsAssets = {
        dies: this.game.add.audio(SOUNDS.DIES),
        cheese: this.game.add.audio(SOUNDS.CHEESE),
        rotten_cheese: this.game.add.audio(SOUNDS.ROTTEN_CHEESE),
        background: this.game.add.audio(SOUNDS.BACKGROUND),
        hit: this.game.add.audio(SOUNDS.HIT),
        menu: this.game.add.audio(SOUNDS.MENU),
        intro: this.game.add.audio(SOUNDS.INTRO),
        start: this.game.add.audio(SOUNDS.START)
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
    if (this.soundsAssets.hasOwnProperty(sound)) {
        this.soundsAssets[sound].stop();
    }
};

var _regularSounds = {
        play: [c.SOUNDS.START]
    }, _continuousSounds = {
        play: [c.SOUNDS.BACKGROUND],
        boot: [c.SOUNDS.MENU]
    };

SoundsManager.prototype.toggle = function (screen) {
    this.active = !this.active;
    var regularSounds = _regularSounds[screen] || [],
        continuousSounds = _continuousSounds[screen] || [],
        i,
        len;
    if(!this.active){
        for(i = 0, len = regularSounds.length;i<len;i++){
            this.stop(regularSounds[i]);
        }
        for(i = 0, len = continuousSounds.length;i<len;i++){
            this.stop(continuousSounds[i]);
        }
    }else{
        for(i = 0, len = regularSounds.length;i<len;i++){
            this.play(regularSounds[i]);
        }
        for(i = 0, len = continuousSounds.length;i<len;i++){
            this.play(continuousSounds[i], true);
        }
    }
};

SoundsManager.prototype.isActive = function () {
    return this.active;
};

SoundsManager.prototype.setActive = function (on) {
    this.active = !!on;
};

SoundsManager.prototype.setGame = function (game) {
    this.game = game;
};

//sounds
module.exports = SoundsManager;
