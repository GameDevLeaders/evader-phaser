'use strict';

/*
 * utils.js
 */

module.exports = {
    getRandomIntInclusive: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};