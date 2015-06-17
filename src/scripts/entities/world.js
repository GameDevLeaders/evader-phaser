'use strict';

var generator = require('./worldGenerator');
var lineSize = 5;
var initialDoors = 3;
var doors = 2;
var currentLine;
var initialVelocity;

var World = function () {
    this.score = 0;
    this.velocity = 50;
    initialVelocity = this.velocity;
    this.update();
};

World.prototype.update = function update() {
    this.score = this.score || 0;
    /***** Calculate doors *****/
    doors = initialDoors - Math.floor(this.score / 9);
    if (doors < 1) {
        doors = 1;
    }
    /***** Generate new line *****/
    currentLine = generator.generateLine(lineSize, doors);
    /***** Adjust velocity *****/
    this.velocity = initialVelocity + Math.floor(this.score / 5) * 20;
};

World.prototype.getLine = function getLine() {
    return currentLine;
};

module.exports = World;
