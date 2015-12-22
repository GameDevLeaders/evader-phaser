'use strict';

var c = require('../constants');
var generator = require('./worldGenerator');
var initialDoors = 3;
var currentLine;
var initialVelocity;
var lineSize;
var doors;

var World = function (props) {
    this.score = 0;
    this.velocity = 100;
    this.turbo = false;
    initialVelocity = this.velocity;

    lineSize = props.lineSize || 5;
    doors = props.doors || 2;

    this.update();
};

World.prototype.update = function update() {
    this.score = this.score || 0;
    /***** Calculate doors *****/
    doors = initialDoors - Math.floor(this.score / 9);
    doors = doors >= lineSize ? lineSize - 1 : doors;
    if (doors < 1) {
        doors = 1;
    }
    /***** Generate new line *****/
    currentLine = generator.generateLine(lineSize, doors);
    /***** Adjust velocity *****/
    this.setVelocity();

};

World.prototype.setVelocity = function setVelocity() {
    if (!this.turbo) {
        this.velocity = this.velocity >= c.MAX_VELOCITY ? c.MAX_VELOCITY : initialVelocity + Math.floor(this.score / 5) * 20;
    }
};

World.prototype.getLine = function getLine() {
    return currentLine;
};

World.prototype.addScore = function addScore(points) {
    if (typeof points === 'number') {
        this.score += points;
    }
};

module.exports = World;
