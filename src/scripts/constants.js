'use strict';

/*
 * Constants used in the whole game :)
 */

module.exports = {
    /***** directions *****/
    LEFT    : 4, // 100
    CENTER  : 2, // 010
    RIGHT   : 1, // 001

    /***** player *****/
    MAX_VELOCITY            : 700,
    MAX_FUEL                : 1,
    STEP                    : 9,
    RESTORE_FACING_DELAY    : 300,
    CONSUME_FUEL_DELAY      : 250,
    
    /***** player sprite *****/
    PRINCESS_WIDTH: 100,
    PRINCESS_HEIGHT: 140,
    PRINCESS_SPRITES: 3,

    /***** lumberjack sprite *****/
    LUMBERJACK_WIDTH: 168,
    LUMBERJACK_HEIGHT: 124,
    LUMBERJACK_SPRITES: 2,
};
