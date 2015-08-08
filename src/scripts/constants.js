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
    MAX_VELOCITY            :  800,
    MAX_FUEL                :  100,
    STEP                    :    9,
    RESTORE_FACING_DELAY    :  300,
    CONSUME_FUEL_DELAY      :  300,
    SLIDE_DISTANCE          :   20,
    TURBO_DELAY             : 1000,
    CHEESE_FUEL             :   15,
    ENEMY_FUEL              :  -30,

    /***** player sprite *****/
    PRINCESS_WIDTH: 100,
    PRINCESS_HEIGHT: 140,
    PRINCESS_SPRITES: 3,

    /***** lumberjack sprite *****/
    LUMBERJACK_WIDTH: 168,
    LUMBERJACK_HEIGHT: 124,
    LUMBERJACK_SPRITES: 2,

    /***** wolf sprite *****/
    WOLF_WIDTH: 124,
    WOLF_HEIGHT: 144,
    WOLF_SPRITES: 2,

    /***** hand sprite *****/
    MOVE_DELAY : 10,
    DELAY_BETWEEN_ANIMATIONS: 500,
    ANIMATION_LENGTH: 1000,

    /*** intro sprites ***/
    PRINCE_WIDTH: 250,
    PRINCE_HEIGHT: 185,
    PRINCE_SPRITES: 2,

    HADA_WIDTH: 200,
    HADA_HEIGHT: 150,
    HADA_SPRITES: 4,

    MOUSE_WIDTH: 200,
    MOUSE_HEIGHT: 150,
    MOUSE_SPRITES: 6,

    PRINCESSGRABBED_WIDTH: 112,
    PRINCESSGRABBED_HEIGHT: 150,
    PRINCESSGRABBED_SPRITES: 2,

    PRINCESSLOOKING_WIDTH: 150,
    PRINCESSLOOKING_HEIGHT: 200,
    PRINCESSLOOKING_SPRITES: 2

};
