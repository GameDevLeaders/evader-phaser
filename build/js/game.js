(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var cfg = require('../../config');

var game = new Phaser.Game(cfg);

game.state.add('boot', require('./states/boot'));
game.state.add('preloader', require('./states/preloader'));
game.state.add('menu', require('./states/menu'));
game.state.add('play', require('./states/play'));
game.state.start('boot');

},{"../../config":2,"./states/boot":11,"./states/menu":12,"./states/play":13,"./states/preloader":14}],2:[function(require,module,exports){
module.exports = {
  name: 'rocket-princess',
  width: '100%',
  height: '100%',
  parent: 'content'
};

},{}],3:[function(require,module,exports){
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
    VELOCITY                :  600,
    RESTORE_FACING_DELAY    :  300,
    CONSUME_FUEL_DELAY      :  300,
    SLIDE_DISTANCE          :   20,
    TURBO_DELAY             : 1000,
    ENEMY_FUEL              :  -30,
    GHOST_TIME              : 1000,
    ENEMY_SPAWN_DELAY       : 2000,

    /***** cheese, cheese, cheese!! *****/
    CHEESE_FUEL                     :   15,
    CHEESE_RESPAWN_TIMEOUT          : 3000, // miliseconds
    ROTTEN_CHEESE_RESPAWN_TIMEOUT   : 5000, // miliseconds

    /***** backgrounds sprites *****/
    CASTLE_WIDTH            :  320,
    CASTLE_HEIGHT           :  320,
    WINDOW_WIDTH            :   80,
    WINDOW_HEIGHT           :  144,
    WINDOW_SPRITES          :    4,

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

    PRINCESSGRABBED_WIDTH: 400,
    PRINCESSGRABBED_HEIGHT: 300,
    PRINCESSGRABBED_SPRITES: 32,

    PRINCESSLOOKING_WIDTH: 150,
    PRINCESSLOOKING_HEIGHT: 200,
    PRINCESSLOOKING_SPRITES: 2,

    TOWER_WIDTH: 400,
    TOWER_HEIGHT: 300,
    TOWER_SPRITES: 24,

    FLYINGPRINCESS_WIDTH: 200,
    FLYINGPRINCESS_HEIGHT: 150,
    FLYTINGPRINCESS_SPRITES: 6,

    /*** sounds ***/
    SOUNDS: {
        BACKGROUND: "background",
        DIES: "dies",
        CHEESE: "cheese",
        ROTTEN_CHEESE: "rotten_cheese",
        HIT: "hit",
        START: "start",
        INTRO: "intro",
        MENU: "menu"
    },

    SPRITES: {
        WINDOWS: [
            'sprites.window.1',
            'sprites.window.2',
            'sprites.window.3',
            'sprites.window.4'
        ],
        SPEAKER_ON: "sprites.settings.speaker_on",
        SPEAKER_OFF: "sprites.settings.speaker_off",
        CLOSE: "sprites.settings.close",
        RESTART: "sprites.settings.restart",
        CREDITS: "sprites.settings.credits",
        HADA: 'hada'
    },

    BUTTONS: {
        PAUSE: "buttons.pauseButton",
        SETTINGS: "buttons.settings"
    },

    SPEED:{
        TILE: 0.2
    },

    STATES: {
        play: 'play',
        gameOver: 'gameOver'
    },

    TEXT: {
        CREDITS: "- Informal Penguins -" +
        "\n" +
        "\n" +
        "Team:" +
        "\n" +
        "- Hector Benitez" +
        "\n" +
        "- Isaac Zepeda" +
        "\n" +
        "- Porfirio Partida" +
        "\n" +
        "- Thannia Blanchet" +
        "\n" +
        "- tonyMtz"
        //ordered by: http://www.online-utility.org/text/sort.jsp
    }
};

},{}],4:[function(require,module,exports){
'use strict';

var c = require('../constants');
var utils = require('../utils');

/*
 * #Cheese
 */

var Cheese = module.exports = function Cheese(gameInstance, x, y, frame) {
    console.assert(gameInstance, 'You should provide a gameInstance instance to this Sprite [Cheese]');

    Phaser.Sprite.call(this, gameInstance, x || utils.getRandomIntInclusive(0, gameInstance.width), y || 0, frame || 'cheese');

    gameInstance.physics.arcade.enable(this);
    gameInstance.add.existing(this);

    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(0.6, 0.6);

    this.checkWorldBounds = true;

    this.spawnTimer = gameInstance.time.create();
    this.spawnTimer.autoDestroy = false;

    this.events.onOutOfBounds.add(function () {
        if (this.position.y > this.game.height) {
            this.reSpawn();
        }
    }, this);

    this.isWaiting = false;
};

Cheese.prototype = Object.create(Phaser.Sprite.prototype);
Cheese.prototype.constructor = Cheese;

/*
 * #update
 */

Cheese.prototype.update = function update() {
    this.body.velocity.y = this.game._world.velocity;

    if (!this.alive && !this.isWaiting) {
        this.isWaiting = true;
        this.reSpawn();
    }

    return this;
};

/*
 * #reSpawn
 */

Cheese.prototype.reSpawn = function reSpawn() {
    this.spawnTimer.destroy();

    this.spawnTimer.add(c.CHEESE_RESPAWN_TIMEOUT, function () {
        this.revive();
        this.reset(utils.getRandomIntInclusive(0, this.game.width), -c.WINDOW_HEIGHT);
        this.isWaiting = false;
    }, this);

    this.spawnTimer.start();
};

},{"../constants":3,"../utils":15}],5:[function(require,module,exports){
'use strict';

var c = require('../constants');
var utils = require('../utils');

var types = ['lumberjack', 'wolf']; // everyone should match with an existing spritesheet.

/*
 * #Enemy
 */

var Enemy = module.exports = function Enemy(gameInstance, x, y) {
    console.assert(gameInstance, 'You should provide a gameInstance instance to this Sprite [Enemy]');

    var randomInt = utils.getRandomIntInclusive(0, 1);

    Phaser.Sprite.call(this, gameInstance, x || 0, y || 0, types[randomInt]);

    this.alive = false;
    this.exists = false;
    this.visible = false;

    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(0.7, 0.7);

    gameInstance.physics.arcade.enable(this);
    gameInstance.add.existing(this);

    this.body.setSize(120, 105);
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

/*
 * #reset
 */

Enemy.prototype.reset = function reset() {
    Phaser.Sprite.prototype.reset.apply(this, arguments);

    this.animations.add('idle');
    this.animations.play('idle', 8, true);

    this.checkWorldBounds = true;
    this.events.onOutOfBounds.add(function () {
        if (this.alive && this.position.y > this.game.height) {
            this.kill();
            this.game._world.addScore(1);
        }
    }, this);
};

/*
 * #update
 */

Enemy.prototype.update = function update() {
    this.body.velocity.y = this.game._world.velocity;
    return this.reRender();
};

/*
 * #reRender
 */

Enemy.prototype.reRender = function reRender() {
    if (this.game._debug) {
        this.game.debug.body(this);
        this.game.debug.bodyInfo(this, 10, 10);
    }

    return this;
};

},{"../constants":3,"../utils":15}],6:[function(require,module,exports){
'use strict';

/*
 * TODO -
 * #faster & #lower are almost the same, refactor those
 */

var c = require('../constants');
var restoreFacingTimer;
var ghostTimer;
var consumeFuelTimer;
var turboTimer;
var oldVelocity;

/*
 * #Princess
 */

var Princess = module.exports = function (gameInstance, x, y) {
    console.assert(gameInstance, 'You should provide a gameInstance instance to this Sprite [Princess]');
    Phaser.Sprite.call(this, gameInstance, x, y, 'princess');

    this._data = {
        fuel: c.MAX_FUEL,
        facing: c.CENTER
    };

    gameInstance.physics.arcade.enable(this);
    gameInstance.add.existing(this);

    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(0.85, 0.85);
    this.body.setSize(50, 105);
    this.body.collideWorldBounds = true;

    this._isGhost = false;

    restoreFacingTimer = gameInstance.time.create();
    restoreFacingTimer.autoDestroy = false;

    ghostTimer = gameInstance.time.create();
    ghostTimer.autoDestroy = false;

    turboTimer = gameInstance.time.create();
    turboTimer.autoDestroy = false;

    consumeFuelTimer = gameInstance.time.events.loop(c.CONSUME_FUEL_DELAY, this.consumeFuel, this);

    if (gameInstance._debug) {
        gameInstance.debug.body(this);
        window.princess = this;
    }
};

Princess.prototype = Object.create(Phaser.Sprite.prototype);
Princess.prototype.constructor = Princess;

/*
 * #move
 */

Princess.prototype.move = function move(direction) {
    var data = this._data;

    data.facing = direction;

    if (c.LEFT === direction) {
        this.body.velocity.x = -c.VELOCITY;
        this.restoreFacing();
    } else if (c.RIGHT === direction) {
        this.body.velocity.x = c.VELOCITY;
        this.restoreFacing();
    } else {
        this.body.velocity.x = 0;
    }

    return this;
};

/*
 * #faster
 */

Princess.prototype.faster = function faster() {
    if (this.game._world.turbo) {
        return;
    }

    turboTimer.destroy();

    oldVelocity = this.game._world.velocity;
    this.game._world.turbo = true;
    this.game._world.velocity = c.MAX_VELOCITY;

    turboTimer.add(c.TURBO_DELAY, function () {
        this.game._world.turbo = false;
        this.game._world.velocity = oldVelocity;
    }, this);

    turboTimer.start();
};

/*
 * #slower
 */

Princess.prototype.slower = function slower() {
    if (this.game._world.turbo) {
        return;
    }

    turboTimer.destroy();

    oldVelocity = this.game._world.velocity;
    this.game._world.turbo = true;
    this.game._world.velocity /= 2;

    turboTimer.add(c.TURBO_DELAY, function () {
        this.game._world.turbo = false;
        this.game._world.velocity = oldVelocity;
    }, this);

    turboTimer.start();
};

/*
 * #update
 */

Princess.prototype.update = function update() {
    return this.checkFuel().reRender();
};

/*
 * #reRender
 */

Princess.prototype.reRender = function reRender() {
    var facing = this._data.facing;

    if (c.LEFT === facing) {
        this.frame = 1;
    } else if (c.RIGHT === facing) {
        this.frame = 2;
    } else {
        this.frame = 0;
    }

    if (this._isGhost) {
        // visual effect goes here
    }

    if (this.game._debug) {
        this.game.debug.body(this);
        this.game.debug.bodyInfo(this, 10, 10);
    }

    return this;
};

/*
 * #restoreFacing
 */

Princess.prototype.restoreFacing = function () {
    restoreFacingTimer.destroy();

    restoreFacingTimer.add(c.RESTORE_FACING_DELAY, function () {
        this._data.facing = c.CENTER;
    }, this);

    restoreFacingTimer.start();
};

/*
 * #damage
 */

Princess.prototype.damage = function () {
    ghostTimer.destroy();

    ghostTimer.add(c.GHOST_TIME, function () {
        this._isGhost = false;
    }, this);

    this._isGhost = true;
    this.consumeFuel(c.ENEMY_FUEL);

    ghostTimer.start();
};

/*
 * #consumeFuel
 */

Princess.prototype.consumeFuel = function consumeFuel(value) {
    this._data.fuel += value || -1;
};

/*
 * #checkFuel
 */
Princess.prototype.checkFuel = function checkFuel() {
    if (this._data.fuel <= 0) {
        //this.game.gameOver.call(this);
        console.log('GAME OVER');
        this.game.time.events.remove(consumeFuelTimer);
    }
    return this;
};

/*
 * #addFuel
 */

Princess.prototype.addFuel = function addFuel(addedValue) {
    var newValue = this._data.fuel + addedValue;
    this._data.fuel = c.MAX_FUEL > newValue ? newValue : c.MAX_FUEL;
    return this;
};

},{"../constants":3}],7:[function(require,module,exports){
'use strict';

var c = require('../constants');
var utils = require('../utils');
var Cheese = require('./cheese');

/*
 * #RottenCheese
 */

var RottenCheese = module.exports = function RottenCheese(gameInstance, x, y) {
    console.assert(gameInstance, 'You should provide a gameInstance instance to this Sprite [RottenCheese]');

    Cheese.call(this, gameInstance, x || utils.getRandomIntInclusive(0, gameInstance.width), y || 0, 'rotten-cheese');

    this.alive = false;
    this.exists = false;
    this.visible = false;
};

RottenCheese.prototype = Object.create(Cheese.prototype);
RottenCheese.prototype.constructor = RottenCheese;

/*
 * #reSpawn
 */

RottenCheese.prototype.reSpawn = function reSpawn() {
    this.spawnTimer.destroy();

    this.spawnTimer.add(c.ROTTEN_CHEESE_RESPAWN_TIMEOUT, function () {
        this.revive();
        this.reset(utils.getRandomIntInclusive(0, this.game.width), -c.WINDOW_HEIGHT);
        this.isWaiting = false;
    }, this);

    this.spawnTimer.start();
};

},{"../constants":3,"../utils":15,"./cheese":4}],8:[function(require,module,exports){
'use strict';

var c = require('../constants');
var utils = require('../utils');

/*
 * #Window
 */

var Window = module.exports = function Window(gameInstance, x, y) {
    console.assert(gameInstance, 'You should provide a gameInstance instance to this Sprite [Window]');

    Phaser.Sprite.call(this, gameInstance, x || 0, y || 0, 'bg-window');

    this.reloadFrame();

    gameInstance.physics.arcade.enable(this);
    gameInstance.add.existing(this);

    this.checkWorldBounds = true;

    this.events.onOutOfBounds.add(function () {
        if (this.position.y > this.game.height) {
            this.reset(this.position.x, -c.WINDOW_HEIGHT);
            this.reloadFrame();
        }
    }, this);
};

Window.prototype = Object.create(Phaser.Sprite.prototype);
Window.prototype.constructor = Window;

/*
 * #reloadFrame
 */

Window.prototype.reloadFrame = function reloadFrame() {
    this.frame = utils.getRandomIntInclusive(0, c.WINDOW_SPRITES);
};

/*
 * #update
 */

Window.prototype.update = function update() {
    this.body.velocity.y = this.game._world.velocity / 2;
    return this;
};

},{"../constants":3,"../utils":15}],9:[function(require,module,exports){
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

},{"../constants":3,"./worldGenerator":10}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
'use strict';

var cfg = require('../../../config');

var Boot = module.exports = function () {
    Phaser.State.call(this);
};
Boot.prototype = Object.create(Phaser.State.prototype);
Boot.prototype.constructor = Boot;

Boot.prototype.preload = function () {
    this.load.baseURL = './assets/';
};

Boot.prototype.create = function () {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.minWidth = cfg.width;
    this.scale.minHeight = cfg.height;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.updateLayout(true);
    this.stage.smoothed = false;

    this.state.start('preloader');

    this.game._debug = window.location.search.replace('?', '') === 'debug';
};

},{"../../../config":2}],12:[function(require,module,exports){
'use strict';

var Menu = module.exports = function () {
  Phaser.State.call(this);
};
Menu.prototype = Object.create(Phaser.State.prototype);
Menu.prototype.constructor = Menu;

Menu.prototype.create = function () {
  var labelStyle = {align: 'center', fill: '#ffffff', font: '15px Arial'};
  var titleStyle = {align: 'center', fill: '#ffffff', font: 'bold 45px Arial'};
  var text, title;

  if (this.game.device.desktop) {
    text = 'Click to start';
  } else {
    text = 'Touch to start';
  }

  title = this.add
    .text(this.world.centerX, 0, 'Demo Project', titleStyle)
    .anchor.setTo(0.5);

  this.add
    .text(this.world.centerX, 150, 'Menu Screen', {fill: '#fff'})
    .anchor.set(0.5);

  this.add
    .text(this.world.centerX, this.world.height - 150, text, labelStyle)
    .anchor.set(0.5);

  this.add.tween(title)
    .to({y: -1})
    .start();

  this.input.onDown.add(this.startGame, this);
};

Menu.prototype.startGame = function () {
  this.state.start('play');
};

},{}],13:[function(require,module,exports){
'use strict';

var c = require('../constants');
var utils = require('../utils');

var Princess = require('../prefabs/princess');
var Enemy = require('../prefabs/enemy');
var World = require('../prefabs/world');
var Window = require('../prefabs/window');
var Cheese = require('../prefabs/cheese');
var RottenCheese = require('../prefabs/rottenCheese');

var Play = module.exports = function () {
    Phaser.State.call(this);
};

Play.prototype = Object.create(Phaser.State.prototype);
Play.prototype.constructor = Play;

var princess;
var bgSky;
var cursors;
var enemyGroup;
var enemiesPerLine;
var castleBg;
var windowBg;
var fuelContainer;
var fuelBar;
var cropRect;
var fuelMaxW;
var enemyCreationTimer;
var cheese;
var rottenCheese;
var rottenCheeseTimer;

Play.prototype.create = function () {
    var game = this.game;

    // game

    if (game._debug) {
        game.stage.disableVisibilityChange = true;
        game.debug.start();
    }

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.setBoundsToWorld();

    enemiesPerLine = Math.ceil(this.game.width / 150);
    enemiesPerLine = enemiesPerLine < 3 ? 3 : enemiesPerLine;

    game._world = new World({
        lineSize: enemiesPerLine
    });

    // bg

    bgSky = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'bg-sky');
    castleBg = game.add.tileSprite(game.world.width / 2 - c.CASTLE_WIDTH / 2, 0, c.CASTLE_WIDTH, game.world.height, 'bg-castle');
    game.physics.enable(castleBg, Phaser.Physics.ARCADE);

    windowBg = new Window(game, game.world.width / 2 - c.WINDOW_WIDTH / 2, -c.WINDOW_HEIGHT);

    // UI
    // 30, 5 is the diff for the container into the first px to render the bar.
    var fuelContainerX = 10;
    var fuelContainerY = 15;
    var fuelBarX = 40;
    var fuelBarY = 20;
    var scoreTextX = 10;
    var scoreTextY = 60;

    fuelContainer = this.game.add.sprite(fuelContainerX, fuelContainerY, 'fuel_container');
    fuelBar = this.game.add.sprite(fuelBarX, fuelBarY, 'fuel');

    cropRect = new Phaser.Rectangle(0, 0, fuelBar.width, fuelBar.height);
    fuelMaxW = fuelBar.width;
    fuelBar.crop(cropRect);

    this.scoreText = this.game.add.bitmapText(scoreTextX + 120, scoreTextY, 'scoreFont', '0', 24);
    this.scoreText.smoothed = false;
    this.game.add.bitmapText(scoreTextX, scoreTextY, 'scoreFont', 'score:', 16);

    // player

    princess = new Princess(game, game.world.centerX, game.height - c.PRINCESS_HEIGHT, 0);

    cursors = game.input.keyboard.createCursorKeys();

    // enemies

    enemyGroup = game.add.group();
    enemyCreationTimer = game.time.events.loop(c.ENEMY_SPAWN_DELAY, this.createEnemies, this);

    // cheeses

    cheese = new Cheese(game);

    rottenCheese = new RottenCheese(game);
    rottenCheeseTimer = game.time.create();
    rottenCheeseTimer.add(c.ROTTEN_CHEESE_RESPAWN_TIMEOUT, function () {
        this.reSpawn();
    }, rottenCheese);
};

Play.prototype.update = function () {
    // bg

    bgSky.tilePosition.y += this.game._world.velocity / 200;

    castleBg.tilePosition.y += this.game._world.velocity / 120;

    windowBg.update();
    cheese.update();

    // controls

    if (cursors.up.isDown) {
        princess.faster();
    } else if (cursors.down.isDown) {
        princess.slower();
    }

    if (cursors.left.isDown) {
        princess.move(c.LEFT);
    } else if (cursors.right.isDown) {
        princess.move(c.RIGHT);
    } else {
        princess.move();
    }

    // game control

    this.physics.arcade.overlap(princess, cheese, function (self, cheese) {
        cheese.kill();
        self.addFuel(c.CHEESE_FUEL);
    }, null, this);

    this.physics.arcade.overlap(princess, rottenCheese, function (self, rottenCheese) {
        rottenCheese.kill();
        self.addFuel(-c.CHEESE_FUEL);
    }, null, this);

    this.physics.arcade.overlap(princess, enemyGroup, function (self, enemy) {
        if (!self._isGhost) {
            enemy.kill();
            self.damage();
        }
    }, null, this);

    princess.update();

    cropRect.width = (princess._data.fuel / c.MAX_FUEL) * fuelMaxW;
    fuelBar.updateCrop();

    // enemies

    enemyGroup.forEach(function (enemy) {
        enemy.update();
    });

    // scoring

    // enemy creating delay follows the equation X = Y * 0.5 + 200 / Y * 1200 where Y is the world's velocity
    enemyCreationTimer.delay = this.game._world.velocity * 0.5 + 200 / this.game._world.velocity * 1200;

    this.game._world.setVelocity();
    this.scoreText.text = this.game._world.score;

    // debug

    if (this.game._debug) {
        console.log('enemies created: ', enemyGroup.length);
    }
};

Play.prototype.createEnemies = function () {
    var game = this.game,
        line = this.game._world.getLine(),
        enemy; //the enemy (Sprite) to be added.

    for (var i = 0; i < line.length; i++) {
        if (line[i] === 0) {
            continue;
        }

        enemy = enemyGroup.getFirstExists(false);

        if (!enemy) {
            enemy = new Enemy(game);
            enemyGroup.add(enemy);
        }

        enemy.revive();
        enemy.reset(i * 140 + 40, -150);
    }

    this.game._world.update();
};

},{"../constants":3,"../prefabs/cheese":4,"../prefabs/enemy":5,"../prefabs/princess":6,"../prefabs/rottenCheese":7,"../prefabs/window":8,"../prefabs/world":9,"../utils":15}],14:[function(require,module,exports){
'use strict';

var c = require('../constants');

var Preloader = module.exports = function () {
    Phaser.State.call(this);
};

Preloader.prototype = Object.create(Phaser.State.prototype);
Preloader.prototype.constructor = Preloader;

Preloader.prototype.preload = function () {
    var load = this.load;

    this.load.bitmapFont('scoreFont', 'fonts/bitmapFonts/carrier_command.png', 'fonts/bitmapFonts/carrier_command.xml');

    load.image('bg-sky', 'sky.png');
    load.image('bg-castle', 'castle.png');
    load.image('fuel_container', 'fuelbar.png');
    load.image('fuel', 'fuelbar-fill.png');
    load.image('cheese', 'cheese.png');
    load.image('rotten-cheese', 'rottencheese.png');
    load.spritesheet('bg-window', 'window.png', c.WINDOW_WIDTH, c.WINDOW_HEIGHT, c.WINDOW_SPRITES);
    load.spritesheet('princess', 'princess.png', c.PRINCESS_WIDTH, c.PRINCESS_HEIGHT, c.PRINCESS_SPRITES);
    load.spritesheet('lumberjack', 'lumberjack.png', c.LUMBERJACK_WIDTH, c.LUMBERJACK_HEIGHT, c.LUMBERJACK_SPRITES);
    load.spritesheet('wolf', 'wolf.png', c.WOLF_WIDTH, c.WOLF_HEIGHT, c.WOLF_SPRITES);
};

Preloader.prototype.create = function () {
    this.state.start('play');
};

},{"../constants":3}],15:[function(require,module,exports){
'use strict';

/*
 * utils.js
 */

module.exports = {
    getRandomIntInclusive: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL3NyYy9zY3JpcHRzL21haW4uanMiLCIvVXNlcnMvdG9ueW10ei9EZXZlbG9wbWVudC9yb2NrZXQtcHJpbmNlc3MvY29uZmlnLmpzIiwiL1VzZXJzL3RvbnltdHovRGV2ZWxvcG1lbnQvcm9ja2V0LXByaW5jZXNzL3NyYy9zY3JpcHRzL2NvbnN0YW50cy5qcyIsIi9Vc2Vycy90b255bXR6L0RldmVsb3BtZW50L3JvY2tldC1wcmluY2Vzcy9zcmMvc2NyaXB0cy9wcmVmYWJzL2NoZWVzZS5qcyIsIi9Vc2Vycy90b255bXR6L0RldmVsb3BtZW50L3JvY2tldC1wcmluY2Vzcy9zcmMvc2NyaXB0cy9wcmVmYWJzL2VuZW15LmpzIiwiL1VzZXJzL3RvbnltdHovRGV2ZWxvcG1lbnQvcm9ja2V0LXByaW5jZXNzL3NyYy9zY3JpcHRzL3ByZWZhYnMvcHJpbmNlc3MuanMiLCIvVXNlcnMvdG9ueW10ei9EZXZlbG9wbWVudC9yb2NrZXQtcHJpbmNlc3Mvc3JjL3NjcmlwdHMvcHJlZmFicy9yb3R0ZW5DaGVlc2UuanMiLCIvVXNlcnMvdG9ueW10ei9EZXZlbG9wbWVudC9yb2NrZXQtcHJpbmNlc3Mvc3JjL3NjcmlwdHMvcHJlZmFicy93aW5kb3cuanMiLCIvVXNlcnMvdG9ueW10ei9EZXZlbG9wbWVudC9yb2NrZXQtcHJpbmNlc3Mvc3JjL3NjcmlwdHMvcHJlZmFicy93b3JsZC5qcyIsIi9Vc2Vycy90b255bXR6L0RldmVsb3BtZW50L3JvY2tldC1wcmluY2Vzcy9zcmMvc2NyaXB0cy9wcmVmYWJzL3dvcmxkR2VuZXJhdG9yLmpzIiwiL1VzZXJzL3RvbnltdHovRGV2ZWxvcG1lbnQvcm9ja2V0LXByaW5jZXNzL3NyYy9zY3JpcHRzL3N0YXRlcy9ib290LmpzIiwiL1VzZXJzL3RvbnltdHovRGV2ZWxvcG1lbnQvcm9ja2V0LXByaW5jZXNzL3NyYy9zY3JpcHRzL3N0YXRlcy9tZW51LmpzIiwiL1VzZXJzL3RvbnltdHovRGV2ZWxvcG1lbnQvcm9ja2V0LXByaW5jZXNzL3NyYy9zY3JpcHRzL3N0YXRlcy9wbGF5LmpzIiwiL1VzZXJzL3RvbnltdHovRGV2ZWxvcG1lbnQvcm9ja2V0LXByaW5jZXNzL3NyYy9zY3JpcHRzL3N0YXRlcy9wcmVsb2FkZXIuanMiLCIvVXNlcnMvdG9ueW10ei9EZXZlbG9wbWVudC9yb2NrZXQtcHJpbmNlc3Mvc3JjL3NjcmlwdHMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2ZnID0gcmVxdWlyZSgnLi4vLi4vY29uZmlnJyk7XG5cbnZhciBnYW1lID0gbmV3IFBoYXNlci5HYW1lKGNmZyk7XG5cbmdhbWUuc3RhdGUuYWRkKCdib290JywgcmVxdWlyZSgnLi9zdGF0ZXMvYm9vdCcpKTtcbmdhbWUuc3RhdGUuYWRkKCdwcmVsb2FkZXInLCByZXF1aXJlKCcuL3N0YXRlcy9wcmVsb2FkZXInKSk7XG5nYW1lLnN0YXRlLmFkZCgnbWVudScsIHJlcXVpcmUoJy4vc3RhdGVzL21lbnUnKSk7XG5nYW1lLnN0YXRlLmFkZCgncGxheScsIHJlcXVpcmUoJy4vc3RhdGVzL3BsYXknKSk7XG5nYW1lLnN0YXRlLnN0YXJ0KCdib290Jyk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgbmFtZTogJ3JvY2tldC1wcmluY2VzcycsXG4gIHdpZHRoOiAnMTAwJScsXG4gIGhlaWdodDogJzEwMCUnLFxuICBwYXJlbnQ6ICdjb250ZW50J1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLypcbiAqIENvbnN0YW50cyB1c2VkIGluIHRoZSB3aG9sZSBnYW1lIDopXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgLyoqKioqIGRpcmVjdGlvbnMgKioqKiovXG4gICAgTEVGVCAgICA6IDQsIC8vIDEwMFxuICAgIENFTlRFUiAgOiAyLCAvLyAwMTBcbiAgICBSSUdIVCAgIDogMSwgLy8gMDAxXG5cbiAgICAvKioqKiogcGxheWVyICoqKioqL1xuICAgIE1BWF9WRUxPQ0lUWSAgICAgICAgICAgIDogIDgwMCxcbiAgICBNQVhfRlVFTCAgICAgICAgICAgICAgICA6ICAxMDAsXG4gICAgVkVMT0NJVFkgICAgICAgICAgICAgICAgOiAgNjAwLFxuICAgIFJFU1RPUkVfRkFDSU5HX0RFTEFZICAgIDogIDMwMCxcbiAgICBDT05TVU1FX0ZVRUxfREVMQVkgICAgICA6ICAzMDAsXG4gICAgU0xJREVfRElTVEFOQ0UgICAgICAgICAgOiAgIDIwLFxuICAgIFRVUkJPX0RFTEFZICAgICAgICAgICAgIDogMTAwMCxcbiAgICBFTkVNWV9GVUVMICAgICAgICAgICAgICA6ICAtMzAsXG4gICAgR0hPU1RfVElNRSAgICAgICAgICAgICAgOiAxMDAwLFxuICAgIEVORU1ZX1NQQVdOX0RFTEFZICAgICAgIDogMjAwMCxcblxuICAgIC8qKioqKiBjaGVlc2UsIGNoZWVzZSwgY2hlZXNlISEgKioqKiovXG4gICAgQ0hFRVNFX0ZVRUwgICAgICAgICAgICAgICAgICAgICA6ICAgMTUsXG4gICAgQ0hFRVNFX1JFU1BBV05fVElNRU9VVCAgICAgICAgICA6IDMwMDAsIC8vIG1pbGlzZWNvbmRzXG4gICAgUk9UVEVOX0NIRUVTRV9SRVNQQVdOX1RJTUVPVVQgICA6IDUwMDAsIC8vIG1pbGlzZWNvbmRzXG5cbiAgICAvKioqKiogYmFja2dyb3VuZHMgc3ByaXRlcyAqKioqKi9cbiAgICBDQVNUTEVfV0lEVEggICAgICAgICAgICA6ICAzMjAsXG4gICAgQ0FTVExFX0hFSUdIVCAgICAgICAgICAgOiAgMzIwLFxuICAgIFdJTkRPV19XSURUSCAgICAgICAgICAgIDogICA4MCxcbiAgICBXSU5ET1dfSEVJR0hUICAgICAgICAgICA6ICAxNDQsXG4gICAgV0lORE9XX1NQUklURVMgICAgICAgICAgOiAgICA0LFxuXG4gICAgLyoqKioqIHBsYXllciBzcHJpdGUgKioqKiovXG4gICAgUFJJTkNFU1NfV0lEVEg6IDEwMCxcbiAgICBQUklOQ0VTU19IRUlHSFQ6IDE0MCxcbiAgICBQUklOQ0VTU19TUFJJVEVTOiAzLFxuXG4gICAgLyoqKioqIGx1bWJlcmphY2sgc3ByaXRlICoqKioqL1xuICAgIExVTUJFUkpBQ0tfV0lEVEg6IDE2OCxcbiAgICBMVU1CRVJKQUNLX0hFSUdIVDogMTI0LFxuICAgIExVTUJFUkpBQ0tfU1BSSVRFUzogMixcblxuICAgIC8qKioqKiB3b2xmIHNwcml0ZSAqKioqKi9cbiAgICBXT0xGX1dJRFRIOiAxMjQsXG4gICAgV09MRl9IRUlHSFQ6IDE0NCxcbiAgICBXT0xGX1NQUklURVM6IDIsXG5cbiAgICAvKioqKiogaGFuZCBzcHJpdGUgKioqKiovXG4gICAgTU9WRV9ERUxBWSA6IDEwLFxuICAgIERFTEFZX0JFVFdFRU5fQU5JTUFUSU9OUzogNTAwLFxuICAgIEFOSU1BVElPTl9MRU5HVEg6IDEwMDAsXG5cbiAgICAvKioqIGludHJvIHNwcml0ZXMgKioqL1xuICAgIFBSSU5DRV9XSURUSDogMjUwLFxuICAgIFBSSU5DRV9IRUlHSFQ6IDE4NSxcbiAgICBQUklOQ0VfU1BSSVRFUzogMixcblxuICAgIEhBREFfV0lEVEg6IDIwMCxcbiAgICBIQURBX0hFSUdIVDogMTUwLFxuICAgIEhBREFfU1BSSVRFUzogNCxcblxuICAgIE1PVVNFX1dJRFRIOiAyMDAsXG4gICAgTU9VU0VfSEVJR0hUOiAxNTAsXG4gICAgTU9VU0VfU1BSSVRFUzogNixcblxuICAgIFBSSU5DRVNTR1JBQkJFRF9XSURUSDogNDAwLFxuICAgIFBSSU5DRVNTR1JBQkJFRF9IRUlHSFQ6IDMwMCxcbiAgICBQUklOQ0VTU0dSQUJCRURfU1BSSVRFUzogMzIsXG5cbiAgICBQUklOQ0VTU0xPT0tJTkdfV0lEVEg6IDE1MCxcbiAgICBQUklOQ0VTU0xPT0tJTkdfSEVJR0hUOiAyMDAsXG4gICAgUFJJTkNFU1NMT09LSU5HX1NQUklURVM6IDIsXG5cbiAgICBUT1dFUl9XSURUSDogNDAwLFxuICAgIFRPV0VSX0hFSUdIVDogMzAwLFxuICAgIFRPV0VSX1NQUklURVM6IDI0LFxuXG4gICAgRkxZSU5HUFJJTkNFU1NfV0lEVEg6IDIwMCxcbiAgICBGTFlJTkdQUklOQ0VTU19IRUlHSFQ6IDE1MCxcbiAgICBGTFlUSU5HUFJJTkNFU1NfU1BSSVRFUzogNixcblxuICAgIC8qKiogc291bmRzICoqKi9cbiAgICBTT1VORFM6IHtcbiAgICAgICAgQkFDS0dST1VORDogXCJiYWNrZ3JvdW5kXCIsXG4gICAgICAgIERJRVM6IFwiZGllc1wiLFxuICAgICAgICBDSEVFU0U6IFwiY2hlZXNlXCIsXG4gICAgICAgIFJPVFRFTl9DSEVFU0U6IFwicm90dGVuX2NoZWVzZVwiLFxuICAgICAgICBISVQ6IFwiaGl0XCIsXG4gICAgICAgIFNUQVJUOiBcInN0YXJ0XCIsXG4gICAgICAgIElOVFJPOiBcImludHJvXCIsXG4gICAgICAgIE1FTlU6IFwibWVudVwiXG4gICAgfSxcblxuICAgIFNQUklURVM6IHtcbiAgICAgICAgV0lORE9XUzogW1xuICAgICAgICAgICAgJ3Nwcml0ZXMud2luZG93LjEnLFxuICAgICAgICAgICAgJ3Nwcml0ZXMud2luZG93LjInLFxuICAgICAgICAgICAgJ3Nwcml0ZXMud2luZG93LjMnLFxuICAgICAgICAgICAgJ3Nwcml0ZXMud2luZG93LjQnXG4gICAgICAgIF0sXG4gICAgICAgIFNQRUFLRVJfT046IFwic3ByaXRlcy5zZXR0aW5ncy5zcGVha2VyX29uXCIsXG4gICAgICAgIFNQRUFLRVJfT0ZGOiBcInNwcml0ZXMuc2V0dGluZ3Muc3BlYWtlcl9vZmZcIixcbiAgICAgICAgQ0xPU0U6IFwic3ByaXRlcy5zZXR0aW5ncy5jbG9zZVwiLFxuICAgICAgICBSRVNUQVJUOiBcInNwcml0ZXMuc2V0dGluZ3MucmVzdGFydFwiLFxuICAgICAgICBDUkVESVRTOiBcInNwcml0ZXMuc2V0dGluZ3MuY3JlZGl0c1wiLFxuICAgICAgICBIQURBOiAnaGFkYSdcbiAgICB9LFxuXG4gICAgQlVUVE9OUzoge1xuICAgICAgICBQQVVTRTogXCJidXR0b25zLnBhdXNlQnV0dG9uXCIsXG4gICAgICAgIFNFVFRJTkdTOiBcImJ1dHRvbnMuc2V0dGluZ3NcIlxuICAgIH0sXG5cbiAgICBTUEVFRDp7XG4gICAgICAgIFRJTEU6IDAuMlxuICAgIH0sXG5cbiAgICBTVEFURVM6IHtcbiAgICAgICAgcGxheTogJ3BsYXknLFxuICAgICAgICBnYW1lT3ZlcjogJ2dhbWVPdmVyJ1xuICAgIH0sXG5cbiAgICBURVhUOiB7XG4gICAgICAgIENSRURJVFM6IFwiLSBJbmZvcm1hbCBQZW5ndWlucyAtXCIgK1xuICAgICAgICBcIlxcblwiICtcbiAgICAgICAgXCJcXG5cIiArXG4gICAgICAgIFwiVGVhbTpcIiArXG4gICAgICAgIFwiXFxuXCIgK1xuICAgICAgICBcIi0gSGVjdG9yIEJlbml0ZXpcIiArXG4gICAgICAgIFwiXFxuXCIgK1xuICAgICAgICBcIi0gSXNhYWMgWmVwZWRhXCIgK1xuICAgICAgICBcIlxcblwiICtcbiAgICAgICAgXCItIFBvcmZpcmlvIFBhcnRpZGFcIiArXG4gICAgICAgIFwiXFxuXCIgK1xuICAgICAgICBcIi0gVGhhbm5pYSBCbGFuY2hldFwiICtcbiAgICAgICAgXCJcXG5cIiArXG4gICAgICAgIFwiLSB0b255TXR6XCJcbiAgICAgICAgLy9vcmRlcmVkIGJ5OiBodHRwOi8vd3d3Lm9ubGluZS11dGlsaXR5Lm9yZy90ZXh0L3NvcnQuanNwXG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbi8qXG4gKiAjQ2hlZXNlXG4gKi9cblxudmFyIENoZWVzZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gQ2hlZXNlKGdhbWVJbnN0YW5jZSwgeCwgeSwgZnJhbWUpIHtcbiAgICBjb25zb2xlLmFzc2VydChnYW1lSW5zdGFuY2UsICdZb3Ugc2hvdWxkIHByb3ZpZGUgYSBnYW1lSW5zdGFuY2UgaW5zdGFuY2UgdG8gdGhpcyBTcHJpdGUgW0NoZWVzZV0nKTtcblxuICAgIFBoYXNlci5TcHJpdGUuY2FsbCh0aGlzLCBnYW1lSW5zdGFuY2UsIHggfHwgdXRpbHMuZ2V0UmFuZG9tSW50SW5jbHVzaXZlKDAsIGdhbWVJbnN0YW5jZS53aWR0aCksIHkgfHwgMCwgZnJhbWUgfHwgJ2NoZWVzZScpO1xuXG4gICAgZ2FtZUluc3RhbmNlLnBoeXNpY3MuYXJjYWRlLmVuYWJsZSh0aGlzKTtcbiAgICBnYW1lSW5zdGFuY2UuYWRkLmV4aXN0aW5nKHRoaXMpO1xuXG4gICAgdGhpcy5hbmNob3Iuc2V0VG8oMC41LCAwLjUpO1xuICAgIHRoaXMuc2NhbGUuc2V0VG8oMC42LCAwLjYpO1xuXG4gICAgdGhpcy5jaGVja1dvcmxkQm91bmRzID0gdHJ1ZTtcblxuICAgIHRoaXMuc3Bhd25UaW1lciA9IGdhbWVJbnN0YW5jZS50aW1lLmNyZWF0ZSgpO1xuICAgIHRoaXMuc3Bhd25UaW1lci5hdXRvRGVzdHJveSA9IGZhbHNlO1xuXG4gICAgdGhpcy5ldmVudHMub25PdXRPZkJvdW5kcy5hZGQoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5wb3NpdGlvbi55ID4gdGhpcy5nYW1lLmhlaWdodCkge1xuICAgICAgICAgICAgdGhpcy5yZVNwYXduKCk7XG4gICAgICAgIH1cbiAgICB9LCB0aGlzKTtcblxuICAgIHRoaXMuaXNXYWl0aW5nID0gZmFsc2U7XG59O1xuXG5DaGVlc2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQaGFzZXIuU3ByaXRlLnByb3RvdHlwZSk7XG5DaGVlc2UucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ2hlZXNlO1xuXG4vKlxuICogI3VwZGF0ZVxuICovXG5cbkNoZWVzZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIHRoaXMuYm9keS52ZWxvY2l0eS55ID0gdGhpcy5nYW1lLl93b3JsZC52ZWxvY2l0eTtcblxuICAgIGlmICghdGhpcy5hbGl2ZSAmJiAhdGhpcy5pc1dhaXRpbmcpIHtcbiAgICAgICAgdGhpcy5pc1dhaXRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnJlU3Bhd24oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qXG4gKiAjcmVTcGF3blxuICovXG5cbkNoZWVzZS5wcm90b3R5cGUucmVTcGF3biA9IGZ1bmN0aW9uIHJlU3Bhd24oKSB7XG4gICAgdGhpcy5zcGF3blRpbWVyLmRlc3Ryb3koKTtcblxuICAgIHRoaXMuc3Bhd25UaW1lci5hZGQoYy5DSEVFU0VfUkVTUEFXTl9USU1FT1VULCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucmV2aXZlKCk7XG4gICAgICAgIHRoaXMucmVzZXQodXRpbHMuZ2V0UmFuZG9tSW50SW5jbHVzaXZlKDAsIHRoaXMuZ2FtZS53aWR0aCksIC1jLldJTkRPV19IRUlHSFQpO1xuICAgICAgICB0aGlzLmlzV2FpdGluZyA9IGZhbHNlO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgdGhpcy5zcGF3blRpbWVyLnN0YXJ0KCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxudmFyIHR5cGVzID0gWydsdW1iZXJqYWNrJywgJ3dvbGYnXTsgLy8gZXZlcnlvbmUgc2hvdWxkIG1hdGNoIHdpdGggYW4gZXhpc3Rpbmcgc3ByaXRlc2hlZXQuXG5cbi8qXG4gKiAjRW5lbXlcbiAqL1xuXG52YXIgRW5lbXkgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEVuZW15KGdhbWVJbnN0YW5jZSwgeCwgeSkge1xuICAgIGNvbnNvbGUuYXNzZXJ0KGdhbWVJbnN0YW5jZSwgJ1lvdSBzaG91bGQgcHJvdmlkZSBhIGdhbWVJbnN0YW5jZSBpbnN0YW5jZSB0byB0aGlzIFNwcml0ZSBbRW5lbXldJyk7XG5cbiAgICB2YXIgcmFuZG9tSW50ID0gdXRpbHMuZ2V0UmFuZG9tSW50SW5jbHVzaXZlKDAsIDEpO1xuXG4gICAgUGhhc2VyLlNwcml0ZS5jYWxsKHRoaXMsIGdhbWVJbnN0YW5jZSwgeCB8fCAwLCB5IHx8IDAsIHR5cGVzW3JhbmRvbUludF0pO1xuXG4gICAgdGhpcy5hbGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuZXhpc3RzID0gZmFsc2U7XG4gICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG5cbiAgICB0aGlzLmFuY2hvci5zZXRUbygwLjUsIDAuNSk7XG4gICAgdGhpcy5zY2FsZS5zZXRUbygwLjcsIDAuNyk7XG5cbiAgICBnYW1lSW5zdGFuY2UucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHRoaXMpO1xuICAgIGdhbWVJbnN0YW5jZS5hZGQuZXhpc3RpbmcodGhpcyk7XG5cbiAgICB0aGlzLmJvZHkuc2V0U2l6ZSgxMjAsIDEwNSk7XG59O1xuXG5FbmVteS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBoYXNlci5TcHJpdGUucHJvdG90eXBlKTtcbkVuZW15LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEVuZW15O1xuXG4vKlxuICogI3Jlc2V0XG4gKi9cblxuRW5lbXkucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgUGhhc2VyLlNwcml0ZS5wcm90b3R5cGUucmVzZXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHRoaXMuYW5pbWF0aW9ucy5hZGQoJ2lkbGUnKTtcbiAgICB0aGlzLmFuaW1hdGlvbnMucGxheSgnaWRsZScsIDgsIHRydWUpO1xuXG4gICAgdGhpcy5jaGVja1dvcmxkQm91bmRzID0gdHJ1ZTtcbiAgICB0aGlzLmV2ZW50cy5vbk91dE9mQm91bmRzLmFkZChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmFsaXZlICYmIHRoaXMucG9zaXRpb24ueSA+IHRoaXMuZ2FtZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMua2lsbCgpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLl93b3JsZC5hZGRTY29yZSgxKTtcbiAgICAgICAgfVxuICAgIH0sIHRoaXMpO1xufTtcblxuLypcbiAqICN1cGRhdGVcbiAqL1xuXG5FbmVteS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIHRoaXMuYm9keS52ZWxvY2l0eS55ID0gdGhpcy5nYW1lLl93b3JsZC52ZWxvY2l0eTtcbiAgICByZXR1cm4gdGhpcy5yZVJlbmRlcigpO1xufTtcblxuLypcbiAqICNyZVJlbmRlclxuICovXG5cbkVuZW15LnByb3RvdHlwZS5yZVJlbmRlciA9IGZ1bmN0aW9uIHJlUmVuZGVyKCkge1xuICAgIGlmICh0aGlzLmdhbWUuX2RlYnVnKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5kZWJ1Zy5ib2R5KHRoaXMpO1xuICAgICAgICB0aGlzLmdhbWUuZGVidWcuYm9keUluZm8odGhpcywgMTAsIDEwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qXG4gKiBUT0RPIC1cbiAqICNmYXN0ZXIgJiAjbG93ZXIgYXJlIGFsbW9zdCB0aGUgc2FtZSwgcmVmYWN0b3IgdGhvc2VcbiAqL1xuXG52YXIgYyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cycpO1xudmFyIHJlc3RvcmVGYWNpbmdUaW1lcjtcbnZhciBnaG9zdFRpbWVyO1xudmFyIGNvbnN1bWVGdWVsVGltZXI7XG52YXIgdHVyYm9UaW1lcjtcbnZhciBvbGRWZWxvY2l0eTtcblxuLypcbiAqICNQcmluY2Vzc1xuICovXG5cbnZhciBQcmluY2VzcyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGdhbWVJbnN0YW5jZSwgeCwgeSkge1xuICAgIGNvbnNvbGUuYXNzZXJ0KGdhbWVJbnN0YW5jZSwgJ1lvdSBzaG91bGQgcHJvdmlkZSBhIGdhbWVJbnN0YW5jZSBpbnN0YW5jZSB0byB0aGlzIFNwcml0ZSBbUHJpbmNlc3NdJyk7XG4gICAgUGhhc2VyLlNwcml0ZS5jYWxsKHRoaXMsIGdhbWVJbnN0YW5jZSwgeCwgeSwgJ3ByaW5jZXNzJyk7XG5cbiAgICB0aGlzLl9kYXRhID0ge1xuICAgICAgICBmdWVsOiBjLk1BWF9GVUVMLFxuICAgICAgICBmYWNpbmc6IGMuQ0VOVEVSXG4gICAgfTtcblxuICAgIGdhbWVJbnN0YW5jZS5waHlzaWNzLmFyY2FkZS5lbmFibGUodGhpcyk7XG4gICAgZ2FtZUluc3RhbmNlLmFkZC5leGlzdGluZyh0aGlzKTtcblxuICAgIHRoaXMuYW5jaG9yLnNldFRvKDAuNSwgMC41KTtcbiAgICB0aGlzLnNjYWxlLnNldFRvKDAuODUsIDAuODUpO1xuICAgIHRoaXMuYm9keS5zZXRTaXplKDUwLCAxMDUpO1xuICAgIHRoaXMuYm9keS5jb2xsaWRlV29ybGRCb3VuZHMgPSB0cnVlO1xuXG4gICAgdGhpcy5faXNHaG9zdCA9IGZhbHNlO1xuXG4gICAgcmVzdG9yZUZhY2luZ1RpbWVyID0gZ2FtZUluc3RhbmNlLnRpbWUuY3JlYXRlKCk7XG4gICAgcmVzdG9yZUZhY2luZ1RpbWVyLmF1dG9EZXN0cm95ID0gZmFsc2U7XG5cbiAgICBnaG9zdFRpbWVyID0gZ2FtZUluc3RhbmNlLnRpbWUuY3JlYXRlKCk7XG4gICAgZ2hvc3RUaW1lci5hdXRvRGVzdHJveSA9IGZhbHNlO1xuXG4gICAgdHVyYm9UaW1lciA9IGdhbWVJbnN0YW5jZS50aW1lLmNyZWF0ZSgpO1xuICAgIHR1cmJvVGltZXIuYXV0b0Rlc3Ryb3kgPSBmYWxzZTtcblxuICAgIGNvbnN1bWVGdWVsVGltZXIgPSBnYW1lSW5zdGFuY2UudGltZS5ldmVudHMubG9vcChjLkNPTlNVTUVfRlVFTF9ERUxBWSwgdGhpcy5jb25zdW1lRnVlbCwgdGhpcyk7XG5cbiAgICBpZiAoZ2FtZUluc3RhbmNlLl9kZWJ1Zykge1xuICAgICAgICBnYW1lSW5zdGFuY2UuZGVidWcuYm9keSh0aGlzKTtcbiAgICAgICAgd2luZG93LnByaW5jZXNzID0gdGhpcztcbiAgICB9XG59O1xuXG5QcmluY2Vzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBoYXNlci5TcHJpdGUucHJvdG90eXBlKTtcblByaW5jZXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFByaW5jZXNzO1xuXG4vKlxuICogI21vdmVcbiAqL1xuXG5QcmluY2Vzcy5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uIG1vdmUoZGlyZWN0aW9uKSB7XG4gICAgdmFyIGRhdGEgPSB0aGlzLl9kYXRhO1xuXG4gICAgZGF0YS5mYWNpbmcgPSBkaXJlY3Rpb247XG5cbiAgICBpZiAoYy5MRUZUID09PSBkaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5ib2R5LnZlbG9jaXR5LnggPSAtYy5WRUxPQ0lUWTtcbiAgICAgICAgdGhpcy5yZXN0b3JlRmFjaW5nKCk7XG4gICAgfSBlbHNlIGlmIChjLlJJR0hUID09PSBkaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5ib2R5LnZlbG9jaXR5LnggPSBjLlZFTE9DSVRZO1xuICAgICAgICB0aGlzLnJlc3RvcmVGYWNpbmcoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmJvZHkudmVsb2NpdHkueCA9IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKlxuICogI2Zhc3RlclxuICovXG5cblByaW5jZXNzLnByb3RvdHlwZS5mYXN0ZXIgPSBmdW5jdGlvbiBmYXN0ZXIoKSB7XG4gICAgaWYgKHRoaXMuZ2FtZS5fd29ybGQudHVyYm8pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHR1cmJvVGltZXIuZGVzdHJveSgpO1xuXG4gICAgb2xkVmVsb2NpdHkgPSB0aGlzLmdhbWUuX3dvcmxkLnZlbG9jaXR5O1xuICAgIHRoaXMuZ2FtZS5fd29ybGQudHVyYm8gPSB0cnVlO1xuICAgIHRoaXMuZ2FtZS5fd29ybGQudmVsb2NpdHkgPSBjLk1BWF9WRUxPQ0lUWTtcblxuICAgIHR1cmJvVGltZXIuYWRkKGMuVFVSQk9fREVMQVksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5nYW1lLl93b3JsZC50dXJibyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmdhbWUuX3dvcmxkLnZlbG9jaXR5ID0gb2xkVmVsb2NpdHk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICB0dXJib1RpbWVyLnN0YXJ0KCk7XG59O1xuXG4vKlxuICogI3Nsb3dlclxuICovXG5cblByaW5jZXNzLnByb3RvdHlwZS5zbG93ZXIgPSBmdW5jdGlvbiBzbG93ZXIoKSB7XG4gICAgaWYgKHRoaXMuZ2FtZS5fd29ybGQudHVyYm8pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHR1cmJvVGltZXIuZGVzdHJveSgpO1xuXG4gICAgb2xkVmVsb2NpdHkgPSB0aGlzLmdhbWUuX3dvcmxkLnZlbG9jaXR5O1xuICAgIHRoaXMuZ2FtZS5fd29ybGQudHVyYm8gPSB0cnVlO1xuICAgIHRoaXMuZ2FtZS5fd29ybGQudmVsb2NpdHkgLz0gMjtcblxuICAgIHR1cmJvVGltZXIuYWRkKGMuVFVSQk9fREVMQVksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5nYW1lLl93b3JsZC50dXJibyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmdhbWUuX3dvcmxkLnZlbG9jaXR5ID0gb2xkVmVsb2NpdHk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICB0dXJib1RpbWVyLnN0YXJ0KCk7XG59O1xuXG4vKlxuICogI3VwZGF0ZVxuICovXG5cblByaW5jZXNzLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hlY2tGdWVsKCkucmVSZW5kZXIoKTtcbn07XG5cbi8qXG4gKiAjcmVSZW5kZXJcbiAqL1xuXG5QcmluY2Vzcy5wcm90b3R5cGUucmVSZW5kZXIgPSBmdW5jdGlvbiByZVJlbmRlcigpIHtcbiAgICB2YXIgZmFjaW5nID0gdGhpcy5fZGF0YS5mYWNpbmc7XG5cbiAgICBpZiAoYy5MRUZUID09PSBmYWNpbmcpIHtcbiAgICAgICAgdGhpcy5mcmFtZSA9IDE7XG4gICAgfSBlbHNlIGlmIChjLlJJR0hUID09PSBmYWNpbmcpIHtcbiAgICAgICAgdGhpcy5mcmFtZSA9IDI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5mcmFtZSA9IDA7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2lzR2hvc3QpIHtcbiAgICAgICAgLy8gdmlzdWFsIGVmZmVjdCBnb2VzIGhlcmVcbiAgICB9XG5cbiAgICBpZiAodGhpcy5nYW1lLl9kZWJ1Zykge1xuICAgICAgICB0aGlzLmdhbWUuZGVidWcuYm9keSh0aGlzKTtcbiAgICAgICAgdGhpcy5nYW1lLmRlYnVnLmJvZHlJbmZvKHRoaXMsIDEwLCAxMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKlxuICogI3Jlc3RvcmVGYWNpbmdcbiAqL1xuXG5QcmluY2Vzcy5wcm90b3R5cGUucmVzdG9yZUZhY2luZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXN0b3JlRmFjaW5nVGltZXIuZGVzdHJveSgpO1xuXG4gICAgcmVzdG9yZUZhY2luZ1RpbWVyLmFkZChjLlJFU1RPUkVfRkFDSU5HX0RFTEFZLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2RhdGEuZmFjaW5nID0gYy5DRU5URVI7XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXN0b3JlRmFjaW5nVGltZXIuc3RhcnQoKTtcbn07XG5cbi8qXG4gKiAjZGFtYWdlXG4gKi9cblxuUHJpbmNlc3MucHJvdG90eXBlLmRhbWFnZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBnaG9zdFRpbWVyLmRlc3Ryb3koKTtcblxuICAgIGdob3N0VGltZXIuYWRkKGMuR0hPU1RfVElNRSwgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9pc0dob3N0ID0gZmFsc2U7XG4gICAgfSwgdGhpcyk7XG5cbiAgICB0aGlzLl9pc0dob3N0ID0gdHJ1ZTtcbiAgICB0aGlzLmNvbnN1bWVGdWVsKGMuRU5FTVlfRlVFTCk7XG5cbiAgICBnaG9zdFRpbWVyLnN0YXJ0KCk7XG59O1xuXG4vKlxuICogI2NvbnN1bWVGdWVsXG4gKi9cblxuUHJpbmNlc3MucHJvdG90eXBlLmNvbnN1bWVGdWVsID0gZnVuY3Rpb24gY29uc3VtZUZ1ZWwodmFsdWUpIHtcbiAgICB0aGlzLl9kYXRhLmZ1ZWwgKz0gdmFsdWUgfHwgLTE7XG59O1xuXG4vKlxuICogI2NoZWNrRnVlbFxuICovXG5QcmluY2Vzcy5wcm90b3R5cGUuY2hlY2tGdWVsID0gZnVuY3Rpb24gY2hlY2tGdWVsKCkge1xuICAgIGlmICh0aGlzLl9kYXRhLmZ1ZWwgPD0gMCkge1xuICAgICAgICAvL3RoaXMuZ2FtZS5nYW1lT3Zlci5jYWxsKHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZygnR0FNRSBPVkVSJyk7XG4gICAgICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5yZW1vdmUoY29uc3VtZUZ1ZWxUaW1lcik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLypcbiAqICNhZGRGdWVsXG4gKi9cblxuUHJpbmNlc3MucHJvdG90eXBlLmFkZEZ1ZWwgPSBmdW5jdGlvbiBhZGRGdWVsKGFkZGVkVmFsdWUpIHtcbiAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLl9kYXRhLmZ1ZWwgKyBhZGRlZFZhbHVlO1xuICAgIHRoaXMuX2RhdGEuZnVlbCA9IGMuTUFYX0ZVRUwgPiBuZXdWYWx1ZSA/IG5ld1ZhbHVlIDogYy5NQVhfRlVFTDtcbiAgICByZXR1cm4gdGhpcztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xudmFyIENoZWVzZSA9IHJlcXVpcmUoJy4vY2hlZXNlJyk7XG5cbi8qXG4gKiAjUm90dGVuQ2hlZXNlXG4gKi9cblxudmFyIFJvdHRlbkNoZWVzZSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gUm90dGVuQ2hlZXNlKGdhbWVJbnN0YW5jZSwgeCwgeSkge1xuICAgIGNvbnNvbGUuYXNzZXJ0KGdhbWVJbnN0YW5jZSwgJ1lvdSBzaG91bGQgcHJvdmlkZSBhIGdhbWVJbnN0YW5jZSBpbnN0YW5jZSB0byB0aGlzIFNwcml0ZSBbUm90dGVuQ2hlZXNlXScpO1xuXG4gICAgQ2hlZXNlLmNhbGwodGhpcywgZ2FtZUluc3RhbmNlLCB4IHx8IHV0aWxzLmdldFJhbmRvbUludEluY2x1c2l2ZSgwLCBnYW1lSW5zdGFuY2Uud2lkdGgpLCB5IHx8IDAsICdyb3R0ZW4tY2hlZXNlJyk7XG5cbiAgICB0aGlzLmFsaXZlID0gZmFsc2U7XG4gICAgdGhpcy5leGlzdHMgPSBmYWxzZTtcbiAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbn07XG5cblJvdHRlbkNoZWVzZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKENoZWVzZS5wcm90b3R5cGUpO1xuUm90dGVuQ2hlZXNlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJvdHRlbkNoZWVzZTtcblxuLypcbiAqICNyZVNwYXduXG4gKi9cblxuUm90dGVuQ2hlZXNlLnByb3RvdHlwZS5yZVNwYXduID0gZnVuY3Rpb24gcmVTcGF3bigpIHtcbiAgICB0aGlzLnNwYXduVGltZXIuZGVzdHJveSgpO1xuXG4gICAgdGhpcy5zcGF3blRpbWVyLmFkZChjLlJPVFRFTl9DSEVFU0VfUkVTUEFXTl9USU1FT1VULCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucmV2aXZlKCk7XG4gICAgICAgIHRoaXMucmVzZXQodXRpbHMuZ2V0UmFuZG9tSW50SW5jbHVzaXZlKDAsIHRoaXMuZ2FtZS53aWR0aCksIC1jLldJTkRPV19IRUlHSFQpO1xuICAgICAgICB0aGlzLmlzV2FpdGluZyA9IGZhbHNlO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgdGhpcy5zcGF3blRpbWVyLnN0YXJ0KCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuLypcbiAqICNXaW5kb3dcbiAqL1xuXG52YXIgV2luZG93ID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBXaW5kb3coZ2FtZUluc3RhbmNlLCB4LCB5KSB7XG4gICAgY29uc29sZS5hc3NlcnQoZ2FtZUluc3RhbmNlLCAnWW91IHNob3VsZCBwcm92aWRlIGEgZ2FtZUluc3RhbmNlIGluc3RhbmNlIHRvIHRoaXMgU3ByaXRlIFtXaW5kb3ddJyk7XG5cbiAgICBQaGFzZXIuU3ByaXRlLmNhbGwodGhpcywgZ2FtZUluc3RhbmNlLCB4IHx8IDAsIHkgfHwgMCwgJ2JnLXdpbmRvdycpO1xuXG4gICAgdGhpcy5yZWxvYWRGcmFtZSgpO1xuXG4gICAgZ2FtZUluc3RhbmNlLnBoeXNpY3MuYXJjYWRlLmVuYWJsZSh0aGlzKTtcbiAgICBnYW1lSW5zdGFuY2UuYWRkLmV4aXN0aW5nKHRoaXMpO1xuXG4gICAgdGhpcy5jaGVja1dvcmxkQm91bmRzID0gdHJ1ZTtcblxuICAgIHRoaXMuZXZlbnRzLm9uT3V0T2ZCb3VuZHMuYWRkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMucG9zaXRpb24ueSA+IHRoaXMuZ2FtZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXQodGhpcy5wb3NpdGlvbi54LCAtYy5XSU5ET1dfSEVJR0hUKTtcbiAgICAgICAgICAgIHRoaXMucmVsb2FkRnJhbWUoKTtcbiAgICAgICAgfVxuICAgIH0sIHRoaXMpO1xufTtcblxuV2luZG93LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUGhhc2VyLlNwcml0ZS5wcm90b3R5cGUpO1xuV2luZG93LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFdpbmRvdztcblxuLypcbiAqICNyZWxvYWRGcmFtZVxuICovXG5cbldpbmRvdy5wcm90b3R5cGUucmVsb2FkRnJhbWUgPSBmdW5jdGlvbiByZWxvYWRGcmFtZSgpIHtcbiAgICB0aGlzLmZyYW1lID0gdXRpbHMuZ2V0UmFuZG9tSW50SW5jbHVzaXZlKDAsIGMuV0lORE9XX1NQUklURVMpO1xufTtcblxuLypcbiAqICN1cGRhdGVcbiAqL1xuXG5XaW5kb3cucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICB0aGlzLmJvZHkudmVsb2NpdHkueSA9IHRoaXMuZ2FtZS5fd29ybGQudmVsb2NpdHkgLyAyO1xuICAgIHJldHVybiB0aGlzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMnKTtcbnZhciBnZW5lcmF0b3IgPSByZXF1aXJlKCcuL3dvcmxkR2VuZXJhdG9yJyk7XG52YXIgaW5pdGlhbERvb3JzID0gMztcbnZhciBjdXJyZW50TGluZTtcbnZhciBpbml0aWFsVmVsb2NpdHk7XG52YXIgbGluZVNpemU7XG52YXIgZG9vcnM7XG5cbnZhciBXb3JsZCA9IGZ1bmN0aW9uIChwcm9wcykge1xuICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgIHRoaXMudmVsb2NpdHkgPSAxMDA7XG4gICAgdGhpcy50dXJibyA9IGZhbHNlO1xuICAgIGluaXRpYWxWZWxvY2l0eSA9IHRoaXMudmVsb2NpdHk7XG5cbiAgICBsaW5lU2l6ZSA9IHByb3BzLmxpbmVTaXplIHx8IDU7XG4gICAgZG9vcnMgPSBwcm9wcy5kb29ycyB8fCAyO1xuXG4gICAgdGhpcy51cGRhdGUoKTtcbn07XG5cbldvcmxkLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgdGhpcy5zY29yZSA9IHRoaXMuc2NvcmUgfHwgMDtcbiAgICAvKioqKiogQ2FsY3VsYXRlIGRvb3JzICoqKioqL1xuICAgIGRvb3JzID0gaW5pdGlhbERvb3JzIC0gTWF0aC5mbG9vcih0aGlzLnNjb3JlIC8gOSk7XG4gICAgZG9vcnMgPSBkb29ycyA+PSBsaW5lU2l6ZSA/IGxpbmVTaXplIC0gMSA6IGRvb3JzO1xuICAgIGlmIChkb29ycyA8IDEpIHtcbiAgICAgICAgZG9vcnMgPSAxO1xuICAgIH1cbiAgICAvKioqKiogR2VuZXJhdGUgbmV3IGxpbmUgKioqKiovXG4gICAgY3VycmVudExpbmUgPSBnZW5lcmF0b3IuZ2VuZXJhdGVMaW5lKGxpbmVTaXplLCBkb29ycyk7XG4gICAgLyoqKioqIEFkanVzdCB2ZWxvY2l0eSAqKioqKi9cbiAgICB0aGlzLnNldFZlbG9jaXR5KCk7XG5cbn07XG5cbldvcmxkLnByb3RvdHlwZS5zZXRWZWxvY2l0eSA9IGZ1bmN0aW9uIHNldFZlbG9jaXR5KCkge1xuICAgIGlmICghdGhpcy50dXJibykge1xuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gdGhpcy52ZWxvY2l0eSA+PSBjLk1BWF9WRUxPQ0lUWSA/IGMuTUFYX1ZFTE9DSVRZIDogaW5pdGlhbFZlbG9jaXR5ICsgTWF0aC5mbG9vcih0aGlzLnNjb3JlIC8gNSkgKiAyMDtcbiAgICB9XG59O1xuXG5Xb3JsZC5wcm90b3R5cGUuZ2V0TGluZSA9IGZ1bmN0aW9uIGdldExpbmUoKSB7XG4gICAgcmV0dXJuIGN1cnJlbnRMaW5lO1xufTtcblxuV29ybGQucHJvdG90eXBlLmFkZFNjb3JlID0gZnVuY3Rpb24gYWRkU2NvcmUocG9pbnRzKSB7XG4gICAgaWYgKHR5cGVvZiBwb2ludHMgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHRoaXMuc2NvcmUgKz0gcG9pbnRzO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gV29ybGQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGdldFJhbmRvbUludChtaW4sIG1heCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSkgKyBtaW47XG59XG5cbmZ1bmN0aW9uIGdldFJhbmRvbUFycmF5KHNpemUsIGxpbWl0KSB7XG4gICAgdmFyIHJhbmRvbUFycmF5ID0gW107XG4gICAgdmFyIGlkeDtcbiAgICB2YXIgYTtcbiAgICB3aGlsZSAoc2l6ZS0tKSB7XG4gICAgICAgIGEgPSBnZXRSYW5kb21JbnQoMCwgbGltaXQpO1xuICAgICAgICBpZHggPSByYW5kb21BcnJheS5pbmRleE9mKGEpO1xuICAgICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgICAgIHNpemUrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJhbmRvbUFycmF5LnB1c2goYSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJhbmRvbUFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZW5lcmF0ZUxpbmU6IGZ1bmN0aW9uIChzaXplLCBkb29ycykge1xuICAgICAgICB2YXIgbGluZSA9IFtdO1xuICAgICAgICB2YXIgaWR4O1xuICAgICAgICBkb29ycyA9IGdldFJhbmRvbUFycmF5KGRvb3JzLCBzaXplKTtcblxuICAgICAgICB3aGlsZSAoc2l6ZS0tKSB7XG4gICAgICAgICAgICBpZHggPSBkb29ycy5pbmRleE9mKHNpemUpO1xuICAgICAgICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgbGluZS5wdXNoKDApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaW5lLnB1c2goMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGluZTtcbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2ZnID0gcmVxdWlyZSgnLi4vLi4vLi4vY29uZmlnJyk7XG5cbnZhciBCb290ID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgUGhhc2VyLlN0YXRlLmNhbGwodGhpcyk7XG59O1xuQm9vdC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBoYXNlci5TdGF0ZS5wcm90b3R5cGUpO1xuQm9vdC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBCb290O1xuXG5Cb290LnByb3RvdHlwZS5wcmVsb2FkID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubG9hZC5iYXNlVVJMID0gJy4vYXNzZXRzLyc7XG59O1xuXG5Cb290LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xuICAgIHRoaXMuc2NhbGUubWluV2lkdGggPSBjZmcud2lkdGg7XG4gICAgdGhpcy5zY2FsZS5taW5IZWlnaHQgPSBjZmcuaGVpZ2h0O1xuICAgIHRoaXMuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcbiAgICB0aGlzLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlO1xuICAgIHRoaXMuc2NhbGUudXBkYXRlTGF5b3V0KHRydWUpO1xuICAgIHRoaXMuc3RhZ2Uuc21vb3RoZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuc3RhdGUuc3RhcnQoJ3ByZWxvYWRlcicpO1xuXG4gICAgdGhpcy5nYW1lLl9kZWJ1ZyA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gucmVwbGFjZSgnPycsICcnKSA9PT0gJ2RlYnVnJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBNZW51ID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIFBoYXNlci5TdGF0ZS5jYWxsKHRoaXMpO1xufTtcbk1lbnUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQaGFzZXIuU3RhdGUucHJvdG90eXBlKTtcbk1lbnUucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTWVudTtcblxuTWVudS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbGFiZWxTdHlsZSA9IHthbGlnbjogJ2NlbnRlcicsIGZpbGw6ICcjZmZmZmZmJywgZm9udDogJzE1cHggQXJpYWwnfTtcbiAgdmFyIHRpdGxlU3R5bGUgPSB7YWxpZ246ICdjZW50ZXInLCBmaWxsOiAnI2ZmZmZmZicsIGZvbnQ6ICdib2xkIDQ1cHggQXJpYWwnfTtcbiAgdmFyIHRleHQsIHRpdGxlO1xuXG4gIGlmICh0aGlzLmdhbWUuZGV2aWNlLmRlc2t0b3ApIHtcbiAgICB0ZXh0ID0gJ0NsaWNrIHRvIHN0YXJ0JztcbiAgfSBlbHNlIHtcbiAgICB0ZXh0ID0gJ1RvdWNoIHRvIHN0YXJ0JztcbiAgfVxuXG4gIHRpdGxlID0gdGhpcy5hZGRcbiAgICAudGV4dCh0aGlzLndvcmxkLmNlbnRlclgsIDAsICdEZW1vIFByb2plY3QnLCB0aXRsZVN0eWxlKVxuICAgIC5hbmNob3Iuc2V0VG8oMC41KTtcblxuICB0aGlzLmFkZFxuICAgIC50ZXh0KHRoaXMud29ybGQuY2VudGVyWCwgMTUwLCAnTWVudSBTY3JlZW4nLCB7ZmlsbDogJyNmZmYnfSlcbiAgICAuYW5jaG9yLnNldCgwLjUpO1xuXG4gIHRoaXMuYWRkXG4gICAgLnRleHQodGhpcy53b3JsZC5jZW50ZXJYLCB0aGlzLndvcmxkLmhlaWdodCAtIDE1MCwgdGV4dCwgbGFiZWxTdHlsZSlcbiAgICAuYW5jaG9yLnNldCgwLjUpO1xuXG4gIHRoaXMuYWRkLnR3ZWVuKHRpdGxlKVxuICAgIC50byh7eTogLTF9KVxuICAgIC5zdGFydCgpO1xuXG4gIHRoaXMuaW5wdXQub25Eb3duLmFkZCh0aGlzLnN0YXJ0R2FtZSwgdGhpcyk7XG59O1xuXG5NZW51LnByb3RvdHlwZS5zdGFydEdhbWUgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuc3RhdGUuc3RhcnQoJ3BsYXknKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG52YXIgUHJpbmNlc3MgPSByZXF1aXJlKCcuLi9wcmVmYWJzL3ByaW5jZXNzJyk7XG52YXIgRW5lbXkgPSByZXF1aXJlKCcuLi9wcmVmYWJzL2VuZW15Jyk7XG52YXIgV29ybGQgPSByZXF1aXJlKCcuLi9wcmVmYWJzL3dvcmxkJyk7XG52YXIgV2luZG93ID0gcmVxdWlyZSgnLi4vcHJlZmFicy93aW5kb3cnKTtcbnZhciBDaGVlc2UgPSByZXF1aXJlKCcuLi9wcmVmYWJzL2NoZWVzZScpO1xudmFyIFJvdHRlbkNoZWVzZSA9IHJlcXVpcmUoJy4uL3ByZWZhYnMvcm90dGVuQ2hlZXNlJyk7XG5cbnZhciBQbGF5ID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgUGhhc2VyLlN0YXRlLmNhbGwodGhpcyk7XG59O1xuXG5QbGF5LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUGhhc2VyLlN0YXRlLnByb3RvdHlwZSk7XG5QbGF5LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFBsYXk7XG5cbnZhciBwcmluY2VzcztcbnZhciBiZ1NreTtcbnZhciBjdXJzb3JzO1xudmFyIGVuZW15R3JvdXA7XG52YXIgZW5lbWllc1BlckxpbmU7XG52YXIgY2FzdGxlQmc7XG52YXIgd2luZG93Qmc7XG52YXIgZnVlbENvbnRhaW5lcjtcbnZhciBmdWVsQmFyO1xudmFyIGNyb3BSZWN0O1xudmFyIGZ1ZWxNYXhXO1xudmFyIGVuZW15Q3JlYXRpb25UaW1lcjtcbnZhciBjaGVlc2U7XG52YXIgcm90dGVuQ2hlZXNlO1xudmFyIHJvdHRlbkNoZWVzZVRpbWVyO1xuXG5QbGF5LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGdhbWUgPSB0aGlzLmdhbWU7XG5cbiAgICAvLyBnYW1lXG5cbiAgICBpZiAoZ2FtZS5fZGVidWcpIHtcbiAgICAgICAgZ2FtZS5zdGFnZS5kaXNhYmxlVmlzaWJpbGl0eUNoYW5nZSA9IHRydWU7XG4gICAgICAgIGdhbWUuZGVidWcuc3RhcnQoKTtcbiAgICB9XG5cbiAgICBnYW1lLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuQVJDQURFKTtcbiAgICBnYW1lLnBoeXNpY3Muc2V0Qm91bmRzVG9Xb3JsZCgpO1xuXG4gICAgZW5lbWllc1BlckxpbmUgPSBNYXRoLmNlaWwodGhpcy5nYW1lLndpZHRoIC8gMTUwKTtcbiAgICBlbmVtaWVzUGVyTGluZSA9IGVuZW1pZXNQZXJMaW5lIDwgMyA/IDMgOiBlbmVtaWVzUGVyTGluZTtcblxuICAgIGdhbWUuX3dvcmxkID0gbmV3IFdvcmxkKHtcbiAgICAgICAgbGluZVNpemU6IGVuZW1pZXNQZXJMaW5lXG4gICAgfSk7XG5cbiAgICAvLyBiZ1xuXG4gICAgYmdTa3kgPSBnYW1lLmFkZC50aWxlU3ByaXRlKDAsIDAsIGdhbWUud29ybGQud2lkdGgsIGdhbWUud29ybGQuaGVpZ2h0LCAnYmctc2t5Jyk7XG4gICAgY2FzdGxlQmcgPSBnYW1lLmFkZC50aWxlU3ByaXRlKGdhbWUud29ybGQud2lkdGggLyAyIC0gYy5DQVNUTEVfV0lEVEggLyAyLCAwLCBjLkNBU1RMRV9XSURUSCwgZ2FtZS53b3JsZC5oZWlnaHQsICdiZy1jYXN0bGUnKTtcbiAgICBnYW1lLnBoeXNpY3MuZW5hYmxlKGNhc3RsZUJnLCBQaGFzZXIuUGh5c2ljcy5BUkNBREUpO1xuXG4gICAgd2luZG93QmcgPSBuZXcgV2luZG93KGdhbWUsIGdhbWUud29ybGQud2lkdGggLyAyIC0gYy5XSU5ET1dfV0lEVEggLyAyLCAtYy5XSU5ET1dfSEVJR0hUKTtcblxuICAgIC8vIFVJXG4gICAgLy8gMzAsIDUgaXMgdGhlIGRpZmYgZm9yIHRoZSBjb250YWluZXIgaW50byB0aGUgZmlyc3QgcHggdG8gcmVuZGVyIHRoZSBiYXIuXG4gICAgdmFyIGZ1ZWxDb250YWluZXJYID0gMTA7XG4gICAgdmFyIGZ1ZWxDb250YWluZXJZID0gMTU7XG4gICAgdmFyIGZ1ZWxCYXJYID0gNDA7XG4gICAgdmFyIGZ1ZWxCYXJZID0gMjA7XG4gICAgdmFyIHNjb3JlVGV4dFggPSAxMDtcbiAgICB2YXIgc2NvcmVUZXh0WSA9IDYwO1xuXG4gICAgZnVlbENvbnRhaW5lciA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKGZ1ZWxDb250YWluZXJYLCBmdWVsQ29udGFpbmVyWSwgJ2Z1ZWxfY29udGFpbmVyJyk7XG4gICAgZnVlbEJhciA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKGZ1ZWxCYXJYLCBmdWVsQmFyWSwgJ2Z1ZWwnKTtcblxuICAgIGNyb3BSZWN0ID0gbmV3IFBoYXNlci5SZWN0YW5nbGUoMCwgMCwgZnVlbEJhci53aWR0aCwgZnVlbEJhci5oZWlnaHQpO1xuICAgIGZ1ZWxNYXhXID0gZnVlbEJhci53aWR0aDtcbiAgICBmdWVsQmFyLmNyb3AoY3JvcFJlY3QpO1xuXG4gICAgdGhpcy5zY29yZVRleHQgPSB0aGlzLmdhbWUuYWRkLmJpdG1hcFRleHQoc2NvcmVUZXh0WCArIDEyMCwgc2NvcmVUZXh0WSwgJ3Njb3JlRm9udCcsICcwJywgMjQpO1xuICAgIHRoaXMuc2NvcmVUZXh0LnNtb290aGVkID0gZmFsc2U7XG4gICAgdGhpcy5nYW1lLmFkZC5iaXRtYXBUZXh0KHNjb3JlVGV4dFgsIHNjb3JlVGV4dFksICdzY29yZUZvbnQnLCAnc2NvcmU6JywgMTYpO1xuXG4gICAgLy8gcGxheWVyXG5cbiAgICBwcmluY2VzcyA9IG5ldyBQcmluY2VzcyhnYW1lLCBnYW1lLndvcmxkLmNlbnRlclgsIGdhbWUuaGVpZ2h0IC0gYy5QUklOQ0VTU19IRUlHSFQsIDApO1xuXG4gICAgY3Vyc29ycyA9IGdhbWUuaW5wdXQua2V5Ym9hcmQuY3JlYXRlQ3Vyc29yS2V5cygpO1xuXG4gICAgLy8gZW5lbWllc1xuXG4gICAgZW5lbXlHcm91cCA9IGdhbWUuYWRkLmdyb3VwKCk7XG4gICAgZW5lbXlDcmVhdGlvblRpbWVyID0gZ2FtZS50aW1lLmV2ZW50cy5sb29wKGMuRU5FTVlfU1BBV05fREVMQVksIHRoaXMuY3JlYXRlRW5lbWllcywgdGhpcyk7XG5cbiAgICAvLyBjaGVlc2VzXG5cbiAgICBjaGVlc2UgPSBuZXcgQ2hlZXNlKGdhbWUpO1xuXG4gICAgcm90dGVuQ2hlZXNlID0gbmV3IFJvdHRlbkNoZWVzZShnYW1lKTtcbiAgICByb3R0ZW5DaGVlc2VUaW1lciA9IGdhbWUudGltZS5jcmVhdGUoKTtcbiAgICByb3R0ZW5DaGVlc2VUaW1lci5hZGQoYy5ST1RURU5fQ0hFRVNFX1JFU1BBV05fVElNRU9VVCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnJlU3Bhd24oKTtcbiAgICB9LCByb3R0ZW5DaGVlc2UpO1xufTtcblxuUGxheS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIGJnXG5cbiAgICBiZ1NreS50aWxlUG9zaXRpb24ueSArPSB0aGlzLmdhbWUuX3dvcmxkLnZlbG9jaXR5IC8gMjAwO1xuXG4gICAgY2FzdGxlQmcudGlsZVBvc2l0aW9uLnkgKz0gdGhpcy5nYW1lLl93b3JsZC52ZWxvY2l0eSAvIDEyMDtcblxuICAgIHdpbmRvd0JnLnVwZGF0ZSgpO1xuICAgIGNoZWVzZS51cGRhdGUoKTtcblxuICAgIC8vIGNvbnRyb2xzXG5cbiAgICBpZiAoY3Vyc29ycy51cC5pc0Rvd24pIHtcbiAgICAgICAgcHJpbmNlc3MuZmFzdGVyKCk7XG4gICAgfSBlbHNlIGlmIChjdXJzb3JzLmRvd24uaXNEb3duKSB7XG4gICAgICAgIHByaW5jZXNzLnNsb3dlcigpO1xuICAgIH1cblxuICAgIGlmIChjdXJzb3JzLmxlZnQuaXNEb3duKSB7XG4gICAgICAgIHByaW5jZXNzLm1vdmUoYy5MRUZUKTtcbiAgICB9IGVsc2UgaWYgKGN1cnNvcnMucmlnaHQuaXNEb3duKSB7XG4gICAgICAgIHByaW5jZXNzLm1vdmUoYy5SSUdIVCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcHJpbmNlc3MubW92ZSgpO1xuICAgIH1cblxuICAgIC8vIGdhbWUgY29udHJvbFxuXG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5vdmVybGFwKHByaW5jZXNzLCBjaGVlc2UsIGZ1bmN0aW9uIChzZWxmLCBjaGVlc2UpIHtcbiAgICAgICAgY2hlZXNlLmtpbGwoKTtcbiAgICAgICAgc2VsZi5hZGRGdWVsKGMuQ0hFRVNFX0ZVRUwpO1xuICAgIH0sIG51bGwsIHRoaXMpO1xuXG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5vdmVybGFwKHByaW5jZXNzLCByb3R0ZW5DaGVlc2UsIGZ1bmN0aW9uIChzZWxmLCByb3R0ZW5DaGVlc2UpIHtcbiAgICAgICAgcm90dGVuQ2hlZXNlLmtpbGwoKTtcbiAgICAgICAgc2VsZi5hZGRGdWVsKC1jLkNIRUVTRV9GVUVMKTtcbiAgICB9LCBudWxsLCB0aGlzKTtcblxuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUub3ZlcmxhcChwcmluY2VzcywgZW5lbXlHcm91cCwgZnVuY3Rpb24gKHNlbGYsIGVuZW15KSB7XG4gICAgICAgIGlmICghc2VsZi5faXNHaG9zdCkge1xuICAgICAgICAgICAgZW5lbXkua2lsbCgpO1xuICAgICAgICAgICAgc2VsZi5kYW1hZ2UoKTtcbiAgICAgICAgfVxuICAgIH0sIG51bGwsIHRoaXMpO1xuXG4gICAgcHJpbmNlc3MudXBkYXRlKCk7XG5cbiAgICBjcm9wUmVjdC53aWR0aCA9IChwcmluY2Vzcy5fZGF0YS5mdWVsIC8gYy5NQVhfRlVFTCkgKiBmdWVsTWF4VztcbiAgICBmdWVsQmFyLnVwZGF0ZUNyb3AoKTtcblxuICAgIC8vIGVuZW1pZXNcblxuICAgIGVuZW15R3JvdXAuZm9yRWFjaChmdW5jdGlvbiAoZW5lbXkpIHtcbiAgICAgICAgZW5lbXkudXBkYXRlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBzY29yaW5nXG5cbiAgICAvLyBlbmVteSBjcmVhdGluZyBkZWxheSBmb2xsb3dzIHRoZSBlcXVhdGlvbiBYID0gWSAqIDAuNSArIDIwMCAvIFkgKiAxMjAwIHdoZXJlIFkgaXMgdGhlIHdvcmxkJ3MgdmVsb2NpdHlcbiAgICBlbmVteUNyZWF0aW9uVGltZXIuZGVsYXkgPSB0aGlzLmdhbWUuX3dvcmxkLnZlbG9jaXR5ICogMC41ICsgMjAwIC8gdGhpcy5nYW1lLl93b3JsZC52ZWxvY2l0eSAqIDEyMDA7XG5cbiAgICB0aGlzLmdhbWUuX3dvcmxkLnNldFZlbG9jaXR5KCk7XG4gICAgdGhpcy5zY29yZVRleHQudGV4dCA9IHRoaXMuZ2FtZS5fd29ybGQuc2NvcmU7XG5cbiAgICAvLyBkZWJ1Z1xuXG4gICAgaWYgKHRoaXMuZ2FtZS5fZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2VuZW1pZXMgY3JlYXRlZDogJywgZW5lbXlHcm91cC5sZW5ndGgpO1xuICAgIH1cbn07XG5cblBsYXkucHJvdG90eXBlLmNyZWF0ZUVuZW1pZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGdhbWUgPSB0aGlzLmdhbWUsXG4gICAgICAgIGxpbmUgPSB0aGlzLmdhbWUuX3dvcmxkLmdldExpbmUoKSxcbiAgICAgICAgZW5lbXk7IC8vdGhlIGVuZW15IChTcHJpdGUpIHRvIGJlIGFkZGVkLlxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChsaW5lW2ldID09PSAwKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVuZW15ID0gZW5lbXlHcm91cC5nZXRGaXJzdEV4aXN0cyhmYWxzZSk7XG5cbiAgICAgICAgaWYgKCFlbmVteSkge1xuICAgICAgICAgICAgZW5lbXkgPSBuZXcgRW5lbXkoZ2FtZSk7XG4gICAgICAgICAgICBlbmVteUdyb3VwLmFkZChlbmVteSk7XG4gICAgICAgIH1cblxuICAgICAgICBlbmVteS5yZXZpdmUoKTtcbiAgICAgICAgZW5lbXkucmVzZXQoaSAqIDE0MCArIDQwLCAtMTUwKTtcbiAgICB9XG5cbiAgICB0aGlzLmdhbWUuX3dvcmxkLnVwZGF0ZSgpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMnKTtcblxudmFyIFByZWxvYWRlciA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICAgIFBoYXNlci5TdGF0ZS5jYWxsKHRoaXMpO1xufTtcblxuUHJlbG9hZGVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUGhhc2VyLlN0YXRlLnByb3RvdHlwZSk7XG5QcmVsb2FkZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUHJlbG9hZGVyO1xuXG5QcmVsb2FkZXIucHJvdG90eXBlLnByZWxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxvYWQgPSB0aGlzLmxvYWQ7XG5cbiAgICB0aGlzLmxvYWQuYml0bWFwRm9udCgnc2NvcmVGb250JywgJ2ZvbnRzL2JpdG1hcEZvbnRzL2NhcnJpZXJfY29tbWFuZC5wbmcnLCAnZm9udHMvYml0bWFwRm9udHMvY2Fycmllcl9jb21tYW5kLnhtbCcpO1xuXG4gICAgbG9hZC5pbWFnZSgnYmctc2t5JywgJ3NreS5wbmcnKTtcbiAgICBsb2FkLmltYWdlKCdiZy1jYXN0bGUnLCAnY2FzdGxlLnBuZycpO1xuICAgIGxvYWQuaW1hZ2UoJ2Z1ZWxfY29udGFpbmVyJywgJ2Z1ZWxiYXIucG5nJyk7XG4gICAgbG9hZC5pbWFnZSgnZnVlbCcsICdmdWVsYmFyLWZpbGwucG5nJyk7XG4gICAgbG9hZC5pbWFnZSgnY2hlZXNlJywgJ2NoZWVzZS5wbmcnKTtcbiAgICBsb2FkLmltYWdlKCdyb3R0ZW4tY2hlZXNlJywgJ3JvdHRlbmNoZWVzZS5wbmcnKTtcbiAgICBsb2FkLnNwcml0ZXNoZWV0KCdiZy13aW5kb3cnLCAnd2luZG93LnBuZycsIGMuV0lORE9XX1dJRFRILCBjLldJTkRPV19IRUlHSFQsIGMuV0lORE9XX1NQUklURVMpO1xuICAgIGxvYWQuc3ByaXRlc2hlZXQoJ3ByaW5jZXNzJywgJ3ByaW5jZXNzLnBuZycsIGMuUFJJTkNFU1NfV0lEVEgsIGMuUFJJTkNFU1NfSEVJR0hULCBjLlBSSU5DRVNTX1NQUklURVMpO1xuICAgIGxvYWQuc3ByaXRlc2hlZXQoJ2x1bWJlcmphY2snLCAnbHVtYmVyamFjay5wbmcnLCBjLkxVTUJFUkpBQ0tfV0lEVEgsIGMuTFVNQkVSSkFDS19IRUlHSFQsIGMuTFVNQkVSSkFDS19TUFJJVEVTKTtcbiAgICBsb2FkLnNwcml0ZXNoZWV0KCd3b2xmJywgJ3dvbGYucG5nJywgYy5XT0xGX1dJRFRILCBjLldPTEZfSEVJR0hULCBjLldPTEZfU1BSSVRFUyk7XG59O1xuXG5QcmVsb2FkZXIucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnN0YXRlLnN0YXJ0KCdwbGF5Jyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKlxuICogdXRpbHMuanNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZXRSYW5kb21JbnRJbmNsdXNpdmU6IGZ1bmN0aW9uIChtaW4sIG1heCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcbiAgICB9XG59OyJdfQ==
