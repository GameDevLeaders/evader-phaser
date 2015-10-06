'use strict';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomArray(size, limit) {
    var randomArray = [];
    var idx;
    var a;
    while (size--) {
        a = getRandomInt(0, limit);
        idx = randomArray.indexOf(a);
        if (idx >= 0) {
            size++;
        } else {
            randomArray.push(a);
        }
    }
    return randomArray;
}

module.exports = {
    generateLine: function (size, doors) {
        var line = [];
        var idx;
        doors = getRandomArray(doors, size);

        while (size--) {
            idx = doors.indexOf(size);
            if (idx >= 0) {
                line.push(0);
            } else {
                line.push(1);
            }
        }

        return line;
    }
};
