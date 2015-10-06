(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var cfg = require('../../config');

var game = new Phaser.Game(cfg);

game.state.add('boot', require('./states/boot'));
game.state.add('preloader', require('./states/preloader'));
game.state.add('menu', require('./states/menu'));
game.state.add('play', require('./states/play'));
game.state.start('boot');

},{"../../config":2,"./states/boot":9,"./states/menu":10,"./states/play":11,"./states/preloader":12}],2:[function(require,module,exports){
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
    CHEESE_FUEL             :   15,
    ENEMY_FUEL              :  -30,
    GHOST_TIME              : 1000,
    ENEMY_SPAWN_DELAY       : 2000,

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

},{"../constants":3,"../utils":13}],5:[function(require,module,exports){
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

},{"../constants":3}],6:[function(require,module,exports){
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
        if (this.alive && this.position.y > this.game.height) {
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

},{"../constants":3,"../utils":13}],7:[function(require,module,exports){
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

},{"../constants":3,"./worldGenerator":8}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"../../../config":2}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
'use strict';

var c = require('../constants');
var utils = require('../utils');

var Princess = require('../prefabs/princess');
var Enemy = require('../prefabs/enemy');
var World = require('../prefabs/world');
var Window = require('../prefabs/window');

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
};

Play.prototype.update = function () {
    // bg

    bgSky.tilePosition.y += this.game._world.velocity / 200;

    castleBg.tilePosition.y += this.game._world.velocity / 120;

    windowBg.update();

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

},{"../constants":3,"../prefabs/enemy":4,"../prefabs/princess":5,"../prefabs/window":6,"../prefabs/world":7,"../utils":13}],12:[function(require,module,exports){
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
    load.spritesheet('bg-window', 'window.png', c.WINDOW_WIDTH, c.WINDOW_HEIGHT, c.WINDOW_SPRITES);
    load.spritesheet('princess', 'princess.png', c.PRINCESS_WIDTH, c.PRINCESS_HEIGHT, c.PRINCESS_SPRITES);
    load.spritesheet('lumberjack', 'lumberjack.png', c.LUMBERJACK_WIDTH, c.LUMBERJACK_HEIGHT, c.LUMBERJACK_SPRITES);
    load.spritesheet('wolf', 'wolf.png', c.WOLF_WIDTH, c.WOLF_HEIGHT, c.WOLF_SPRITES);
};

Preloader.prototype.create = function () {
    this.state.start('play');
};

},{"../constants":3}],13:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL3NyYy9zY3JpcHRzL21haW4uanMiLCIvVXNlcnMvdG9ueW10ei9kZXZlbG9wbWVudC9yb2NrZXQtcHJpbmNlc3MvY29uZmlnLmpzIiwiL1VzZXJzL3RvbnltdHovZGV2ZWxvcG1lbnQvcm9ja2V0LXByaW5jZXNzL3NyYy9zY3JpcHRzL2NvbnN0YW50cy5qcyIsIi9Vc2Vycy90b255bXR6L2RldmVsb3BtZW50L3JvY2tldC1wcmluY2Vzcy9zcmMvc2NyaXB0cy9wcmVmYWJzL2VuZW15LmpzIiwiL1VzZXJzL3RvbnltdHovZGV2ZWxvcG1lbnQvcm9ja2V0LXByaW5jZXNzL3NyYy9zY3JpcHRzL3ByZWZhYnMvcHJpbmNlc3MuanMiLCIvVXNlcnMvdG9ueW10ei9kZXZlbG9wbWVudC9yb2NrZXQtcHJpbmNlc3Mvc3JjL3NjcmlwdHMvcHJlZmFicy93aW5kb3cuanMiLCIvVXNlcnMvdG9ueW10ei9kZXZlbG9wbWVudC9yb2NrZXQtcHJpbmNlc3Mvc3JjL3NjcmlwdHMvcHJlZmFicy93b3JsZC5qcyIsIi9Vc2Vycy90b255bXR6L2RldmVsb3BtZW50L3JvY2tldC1wcmluY2Vzcy9zcmMvc2NyaXB0cy9wcmVmYWJzL3dvcmxkR2VuZXJhdG9yLmpzIiwiL1VzZXJzL3RvbnltdHovZGV2ZWxvcG1lbnQvcm9ja2V0LXByaW5jZXNzL3NyYy9zY3JpcHRzL3N0YXRlcy9ib290LmpzIiwiL1VzZXJzL3RvbnltdHovZGV2ZWxvcG1lbnQvcm9ja2V0LXByaW5jZXNzL3NyYy9zY3JpcHRzL3N0YXRlcy9tZW51LmpzIiwiL1VzZXJzL3RvbnltdHovZGV2ZWxvcG1lbnQvcm9ja2V0LXByaW5jZXNzL3NyYy9zY3JpcHRzL3N0YXRlcy9wbGF5LmpzIiwiL1VzZXJzL3RvbnltdHovZGV2ZWxvcG1lbnQvcm9ja2V0LXByaW5jZXNzL3NyYy9zY3JpcHRzL3N0YXRlcy9wcmVsb2FkZXIuanMiLCIvVXNlcnMvdG9ueW10ei9kZXZlbG9wbWVudC9yb2NrZXQtcHJpbmNlc3Mvc3JjL3NjcmlwdHMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2ZnID0gcmVxdWlyZSgnLi4vLi4vY29uZmlnJyk7XG5cbnZhciBnYW1lID0gbmV3IFBoYXNlci5HYW1lKGNmZyk7XG5cbmdhbWUuc3RhdGUuYWRkKCdib290JywgcmVxdWlyZSgnLi9zdGF0ZXMvYm9vdCcpKTtcbmdhbWUuc3RhdGUuYWRkKCdwcmVsb2FkZXInLCByZXF1aXJlKCcuL3N0YXRlcy9wcmVsb2FkZXInKSk7XG5nYW1lLnN0YXRlLmFkZCgnbWVudScsIHJlcXVpcmUoJy4vc3RhdGVzL21lbnUnKSk7XG5nYW1lLnN0YXRlLmFkZCgncGxheScsIHJlcXVpcmUoJy4vc3RhdGVzL3BsYXknKSk7XG5nYW1lLnN0YXRlLnN0YXJ0KCdib290Jyk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgbmFtZTogJ3JvY2tldC1wcmluY2VzcycsXG4gIHdpZHRoOiAnMTAwJScsXG4gIGhlaWdodDogJzEwMCUnLFxuICBwYXJlbnQ6ICdjb250ZW50J1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLypcbiAqIENvbnN0YW50cyB1c2VkIGluIHRoZSB3aG9sZSBnYW1lIDopXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgLyoqKioqIGRpcmVjdGlvbnMgKioqKiovXG4gICAgTEVGVCAgICA6IDQsIC8vIDEwMFxuICAgIENFTlRFUiAgOiAyLCAvLyAwMTBcbiAgICBSSUdIVCAgIDogMSwgLy8gMDAxXG5cbiAgICAvKioqKiogcGxheWVyICoqKioqL1xuICAgIE1BWF9WRUxPQ0lUWSAgICAgICAgICAgIDogIDgwMCxcbiAgICBNQVhfRlVFTCAgICAgICAgICAgICAgICA6ICAxMDAsXG4gICAgVkVMT0NJVFkgICAgICAgICAgICAgICAgOiAgNjAwLFxuICAgIFJFU1RPUkVfRkFDSU5HX0RFTEFZICAgIDogIDMwMCxcbiAgICBDT05TVU1FX0ZVRUxfREVMQVkgICAgICA6ICAzMDAsXG4gICAgU0xJREVfRElTVEFOQ0UgICAgICAgICAgOiAgIDIwLFxuICAgIFRVUkJPX0RFTEFZICAgICAgICAgICAgIDogMTAwMCxcbiAgICBDSEVFU0VfRlVFTCAgICAgICAgICAgICA6ICAgMTUsXG4gICAgRU5FTVlfRlVFTCAgICAgICAgICAgICAgOiAgLTMwLFxuICAgIEdIT1NUX1RJTUUgICAgICAgICAgICAgIDogMTAwMCxcbiAgICBFTkVNWV9TUEFXTl9ERUxBWSAgICAgICA6IDIwMDAsXG5cbiAgICAvKioqKiogYmFja2dyb3VuZHMgc3ByaXRlcyAqKioqKi9cbiAgICBDQVNUTEVfV0lEVEggICAgICAgICAgICA6ICAzMjAsXG4gICAgQ0FTVExFX0hFSUdIVCAgICAgICAgICAgOiAgMzIwLFxuICAgIFdJTkRPV19XSURUSCAgICAgICAgICAgIDogICA4MCxcbiAgICBXSU5ET1dfSEVJR0hUICAgICAgICAgICA6ICAxNDQsXG4gICAgV0lORE9XX1NQUklURVMgICAgICAgICAgOiAgICA0LFxuXG4gICAgLyoqKioqIHBsYXllciBzcHJpdGUgKioqKiovXG4gICAgUFJJTkNFU1NfV0lEVEg6IDEwMCxcbiAgICBQUklOQ0VTU19IRUlHSFQ6IDE0MCxcbiAgICBQUklOQ0VTU19TUFJJVEVTOiAzLFxuXG4gICAgLyoqKioqIGx1bWJlcmphY2sgc3ByaXRlICoqKioqL1xuICAgIExVTUJFUkpBQ0tfV0lEVEg6IDE2OCxcbiAgICBMVU1CRVJKQUNLX0hFSUdIVDogMTI0LFxuICAgIExVTUJFUkpBQ0tfU1BSSVRFUzogMixcblxuICAgIC8qKioqKiB3b2xmIHNwcml0ZSAqKioqKi9cbiAgICBXT0xGX1dJRFRIOiAxMjQsXG4gICAgV09MRl9IRUlHSFQ6IDE0NCxcbiAgICBXT0xGX1NQUklURVM6IDIsXG5cbiAgICAvKioqKiogaGFuZCBzcHJpdGUgKioqKiovXG4gICAgTU9WRV9ERUxBWSA6IDEwLFxuICAgIERFTEFZX0JFVFdFRU5fQU5JTUFUSU9OUzogNTAwLFxuICAgIEFOSU1BVElPTl9MRU5HVEg6IDEwMDAsXG5cbiAgICAvKioqIGludHJvIHNwcml0ZXMgKioqL1xuICAgIFBSSU5DRV9XSURUSDogMjUwLFxuICAgIFBSSU5DRV9IRUlHSFQ6IDE4NSxcbiAgICBQUklOQ0VfU1BSSVRFUzogMixcblxuICAgIEhBREFfV0lEVEg6IDIwMCxcbiAgICBIQURBX0hFSUdIVDogMTUwLFxuICAgIEhBREFfU1BSSVRFUzogNCxcblxuICAgIE1PVVNFX1dJRFRIOiAyMDAsXG4gICAgTU9VU0VfSEVJR0hUOiAxNTAsXG4gICAgTU9VU0VfU1BSSVRFUzogNixcblxuICAgIFBSSU5DRVNTR1JBQkJFRF9XSURUSDogNDAwLFxuICAgIFBSSU5DRVNTR1JBQkJFRF9IRUlHSFQ6IDMwMCxcbiAgICBQUklOQ0VTU0dSQUJCRURfU1BSSVRFUzogMzIsXG5cbiAgICBQUklOQ0VTU0xPT0tJTkdfV0lEVEg6IDE1MCxcbiAgICBQUklOQ0VTU0xPT0tJTkdfSEVJR0hUOiAyMDAsXG4gICAgUFJJTkNFU1NMT09LSU5HX1NQUklURVM6IDIsXG5cbiAgICBUT1dFUl9XSURUSDogNDAwLFxuICAgIFRPV0VSX0hFSUdIVDogMzAwLFxuICAgIFRPV0VSX1NQUklURVM6IDI0LFxuXG4gICAgRkxZSU5HUFJJTkNFU1NfV0lEVEg6IDIwMCxcbiAgICBGTFlJTkdQUklOQ0VTU19IRUlHSFQ6IDE1MCxcbiAgICBGTFlUSU5HUFJJTkNFU1NfU1BSSVRFUzogNixcblxuICAgIC8qKiogc291bmRzICoqKi9cbiAgICBTT1VORFM6IHtcbiAgICAgICAgQkFDS0dST1VORDogXCJiYWNrZ3JvdW5kXCIsXG4gICAgICAgIERJRVM6IFwiZGllc1wiLFxuICAgICAgICBDSEVFU0U6IFwiY2hlZXNlXCIsXG4gICAgICAgIFJPVFRFTl9DSEVFU0U6IFwicm90dGVuX2NoZWVzZVwiLFxuICAgICAgICBISVQ6IFwiaGl0XCIsXG4gICAgICAgIFNUQVJUOiBcInN0YXJ0XCIsXG4gICAgICAgIElOVFJPOiBcImludHJvXCIsXG4gICAgICAgIE1FTlU6IFwibWVudVwiXG4gICAgfSxcbiAgICBTUFJJVEVTOiB7XG4gICAgICAgIFdJTkRPV1M6IFtcbiAgICAgICAgICAgICdzcHJpdGVzLndpbmRvdy4xJyxcbiAgICAgICAgICAgICdzcHJpdGVzLndpbmRvdy4yJyxcbiAgICAgICAgICAgICdzcHJpdGVzLndpbmRvdy4zJyxcbiAgICAgICAgICAgICdzcHJpdGVzLndpbmRvdy40J1xuICAgICAgICBdLFxuICAgICAgICBTUEVBS0VSX09OOiBcInNwcml0ZXMuc2V0dGluZ3Muc3BlYWtlcl9vblwiLFxuICAgICAgICBTUEVBS0VSX09GRjogXCJzcHJpdGVzLnNldHRpbmdzLnNwZWFrZXJfb2ZmXCIsXG4gICAgICAgIENMT1NFOiBcInNwcml0ZXMuc2V0dGluZ3MuY2xvc2VcIixcbiAgICAgICAgUkVTVEFSVDogXCJzcHJpdGVzLnNldHRpbmdzLnJlc3RhcnRcIixcbiAgICAgICAgQ1JFRElUUzogXCJzcHJpdGVzLnNldHRpbmdzLmNyZWRpdHNcIixcbiAgICAgICAgSEFEQTogJ2hhZGEnXG4gICAgfSxcbiAgICBCVVRUT05TOiB7XG4gICAgICAgIFBBVVNFOiBcImJ1dHRvbnMucGF1c2VCdXR0b25cIixcbiAgICAgICAgU0VUVElOR1M6IFwiYnV0dG9ucy5zZXR0aW5nc1wiXG4gICAgfSxcbiAgICBTUEVFRDp7XG4gICAgICAgIFRJTEU6IDAuMlxuICAgIH0sXG4gICAgU1RBVEVTOiB7XG4gICAgICAgIHBsYXk6ICdwbGF5JyxcbiAgICAgICAgZ2FtZU92ZXI6ICdnYW1lT3ZlcidcbiAgICB9LFxuICAgIFRFWFQ6IHtcbiAgICAgICAgQ1JFRElUUzogXCItIEluZm9ybWFsIFBlbmd1aW5zIC1cIiArXG4gICAgICAgIFwiXFxuXCIgK1xuICAgICAgICBcIlxcblwiICtcbiAgICAgICAgXCJUZWFtOlwiICtcbiAgICAgICAgXCJcXG5cIiArXG4gICAgICAgIFwiLSBIZWN0b3IgQmVuaXRlelwiICtcbiAgICAgICAgXCJcXG5cIiArXG4gICAgICAgIFwiLSBJc2FhYyBaZXBlZGFcIiArXG4gICAgICAgIFwiXFxuXCIgK1xuICAgICAgICBcIi0gUG9yZmlyaW8gUGFydGlkYVwiICtcbiAgICAgICAgXCJcXG5cIiArXG4gICAgICAgIFwiLSBUaGFubmlhIEJsYW5jaGV0XCIgK1xuICAgICAgICBcIlxcblwiICtcbiAgICAgICAgXCItIHRvbnlNdHpcIlxuICAgICAgICAvL29yZGVyZWQgYnk6IGh0dHA6Ly93d3cub25saW5lLXV0aWxpdHkub3JnL3RleHQvc29ydC5qc3BcbiAgICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbnZhciB0eXBlcyA9IFsnbHVtYmVyamFjaycsICd3b2xmJ107IC8vIGV2ZXJ5b25lIHNob3VsZCBtYXRjaCB3aXRoIGFuIGV4aXN0aW5nIHNwcml0ZXNoZWV0LlxuXG4vKlxuICogI0VuZW15XG4gKi9cblxudmFyIEVuZW15ID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBFbmVteShnYW1lSW5zdGFuY2UsIHgsIHkpIHtcbiAgICBjb25zb2xlLmFzc2VydChnYW1lSW5zdGFuY2UsICdZb3Ugc2hvdWxkIHByb3ZpZGUgYSBnYW1lSW5zdGFuY2UgaW5zdGFuY2UgdG8gdGhpcyBTcHJpdGUgW0VuZW15XScpO1xuXG4gICAgdmFyIHJhbmRvbUludCA9IHV0aWxzLmdldFJhbmRvbUludEluY2x1c2l2ZSgwLCAxKTtcblxuICAgIFBoYXNlci5TcHJpdGUuY2FsbCh0aGlzLCBnYW1lSW5zdGFuY2UsIHggfHwgMCwgeSB8fCAwLCB0eXBlc1tyYW5kb21JbnRdKTtcblxuICAgIHRoaXMuYWxpdmUgPSBmYWxzZTtcbiAgICB0aGlzLmV4aXN0cyA9IGZhbHNlO1xuICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgdGhpcy5hbmNob3Iuc2V0VG8oMC41LCAwLjUpO1xuICAgIHRoaXMuc2NhbGUuc2V0VG8oMC43LCAwLjcpO1xuXG4gICAgZ2FtZUluc3RhbmNlLnBoeXNpY3MuYXJjYWRlLmVuYWJsZSh0aGlzKTtcbiAgICBnYW1lSW5zdGFuY2UuYWRkLmV4aXN0aW5nKHRoaXMpO1xuXG4gICAgdGhpcy5ib2R5LnNldFNpemUoMTIwLCAxMDUpO1xufTtcblxuRW5lbXkucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQaGFzZXIuU3ByaXRlLnByb3RvdHlwZSk7XG5FbmVteS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBFbmVteTtcblxuLypcbiAqICNyZXNldFxuICovXG5cbkVuZW15LnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgIFBoYXNlci5TcHJpdGUucHJvdG90eXBlLnJlc2V0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICB0aGlzLmFuaW1hdGlvbnMuYWRkKCdpZGxlJyk7XG4gICAgdGhpcy5hbmltYXRpb25zLnBsYXkoJ2lkbGUnLCA4LCB0cnVlKTtcblxuICAgIHRoaXMuY2hlY2tXb3JsZEJvdW5kcyA9IHRydWU7XG4gICAgdGhpcy5ldmVudHMub25PdXRPZkJvdW5kcy5hZGQoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5hbGl2ZSAmJiB0aGlzLnBvc2l0aW9uLnkgPiB0aGlzLmdhbWUuaGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLmtpbGwoKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5fd29ybGQuYWRkU2NvcmUoMSk7XG4gICAgICAgIH1cbiAgICB9LCB0aGlzKTtcbn07XG5cbi8qXG4gKiAjdXBkYXRlXG4gKi9cblxuRW5lbXkucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICB0aGlzLmJvZHkudmVsb2NpdHkueSA9IHRoaXMuZ2FtZS5fd29ybGQudmVsb2NpdHk7XG4gICAgcmV0dXJuIHRoaXMucmVSZW5kZXIoKTtcbn07XG5cbi8qXG4gKiAjcmVSZW5kZXJcbiAqL1xuXG5FbmVteS5wcm90b3R5cGUucmVSZW5kZXIgPSBmdW5jdGlvbiByZVJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5nYW1lLl9kZWJ1Zykge1xuICAgICAgICB0aGlzLmdhbWUuZGVidWcuYm9keSh0aGlzKTtcbiAgICAgICAgdGhpcy5nYW1lLmRlYnVnLmJvZHlJbmZvKHRoaXMsIDEwLCAxMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKlxuICogVE9ETyAtXG4gKiAjZmFzdGVyICYgI2xvd2VyIGFyZSBhbG1vc3QgdGhlIHNhbWUsIHJlZmFjdG9yIHRob3NlXG4gKi9cblxudmFyIGMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMnKTtcbnZhciByZXN0b3JlRmFjaW5nVGltZXI7XG52YXIgZ2hvc3RUaW1lcjtcbnZhciBjb25zdW1lRnVlbFRpbWVyO1xudmFyIHR1cmJvVGltZXI7XG52YXIgb2xkVmVsb2NpdHk7XG5cbi8qXG4gKiAjUHJpbmNlc3NcbiAqL1xuXG52YXIgUHJpbmNlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChnYW1lSW5zdGFuY2UsIHgsIHkpIHtcbiAgICBjb25zb2xlLmFzc2VydChnYW1lSW5zdGFuY2UsICdZb3Ugc2hvdWxkIHByb3ZpZGUgYSBnYW1lSW5zdGFuY2UgaW5zdGFuY2UgdG8gdGhpcyBTcHJpdGUgW1ByaW5jZXNzXScpO1xuICAgIFBoYXNlci5TcHJpdGUuY2FsbCh0aGlzLCBnYW1lSW5zdGFuY2UsIHgsIHksICdwcmluY2VzcycpO1xuXG4gICAgdGhpcy5fZGF0YSA9IHtcbiAgICAgICAgZnVlbDogYy5NQVhfRlVFTCxcbiAgICAgICAgZmFjaW5nOiBjLkNFTlRFUlxuICAgIH07XG5cbiAgICBnYW1lSW5zdGFuY2UucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHRoaXMpO1xuICAgIGdhbWVJbnN0YW5jZS5hZGQuZXhpc3RpbmcodGhpcyk7XG5cbiAgICB0aGlzLmFuY2hvci5zZXRUbygwLjUsIDAuNSk7XG4gICAgdGhpcy5zY2FsZS5zZXRUbygwLjg1LCAwLjg1KTtcbiAgICB0aGlzLmJvZHkuc2V0U2l6ZSg1MCwgMTA1KTtcbiAgICB0aGlzLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gdHJ1ZTtcblxuICAgIHRoaXMuX2lzR2hvc3QgPSBmYWxzZTtcblxuICAgIHJlc3RvcmVGYWNpbmdUaW1lciA9IGdhbWVJbnN0YW5jZS50aW1lLmNyZWF0ZSgpO1xuICAgIHJlc3RvcmVGYWNpbmdUaW1lci5hdXRvRGVzdHJveSA9IGZhbHNlO1xuXG4gICAgZ2hvc3RUaW1lciA9IGdhbWVJbnN0YW5jZS50aW1lLmNyZWF0ZSgpO1xuICAgIGdob3N0VGltZXIuYXV0b0Rlc3Ryb3kgPSBmYWxzZTtcblxuICAgIHR1cmJvVGltZXIgPSBnYW1lSW5zdGFuY2UudGltZS5jcmVhdGUoKTtcbiAgICB0dXJib1RpbWVyLmF1dG9EZXN0cm95ID0gZmFsc2U7XG5cbiAgICBjb25zdW1lRnVlbFRpbWVyID0gZ2FtZUluc3RhbmNlLnRpbWUuZXZlbnRzLmxvb3AoYy5DT05TVU1FX0ZVRUxfREVMQVksIHRoaXMuY29uc3VtZUZ1ZWwsIHRoaXMpO1xuXG4gICAgaWYgKGdhbWVJbnN0YW5jZS5fZGVidWcpIHtcbiAgICAgICAgZ2FtZUluc3RhbmNlLmRlYnVnLmJvZHkodGhpcyk7XG4gICAgICAgIHdpbmRvdy5wcmluY2VzcyA9IHRoaXM7XG4gICAgfVxufTtcblxuUHJpbmNlc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQaGFzZXIuU3ByaXRlLnByb3RvdHlwZSk7XG5QcmluY2Vzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBQcmluY2VzcztcblxuLypcbiAqICNtb3ZlXG4gKi9cblxuUHJpbmNlc3MucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbiBtb3ZlKGRpcmVjdGlvbikge1xuICAgIHZhciBkYXRhID0gdGhpcy5fZGF0YTtcblxuICAgIGRhdGEuZmFjaW5nID0gZGlyZWN0aW9uO1xuXG4gICAgaWYgKGMuTEVGVCA9PT0gZGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuYm9keS52ZWxvY2l0eS54ID0gLWMuVkVMT0NJVFk7XG4gICAgICAgIHRoaXMucmVzdG9yZUZhY2luZygpO1xuICAgIH0gZWxzZSBpZiAoYy5SSUdIVCA9PT0gZGlyZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuYm9keS52ZWxvY2l0eS54ID0gYy5WRUxPQ0lUWTtcbiAgICAgICAgdGhpcy5yZXN0b3JlRmFjaW5nKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5ib2R5LnZlbG9jaXR5LnggPSAwO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLypcbiAqICNmYXN0ZXJcbiAqL1xuXG5QcmluY2Vzcy5wcm90b3R5cGUuZmFzdGVyID0gZnVuY3Rpb24gZmFzdGVyKCkge1xuICAgIGlmICh0aGlzLmdhbWUuX3dvcmxkLnR1cmJvKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0dXJib1RpbWVyLmRlc3Ryb3koKTtcblxuICAgIG9sZFZlbG9jaXR5ID0gdGhpcy5nYW1lLl93b3JsZC52ZWxvY2l0eTtcbiAgICB0aGlzLmdhbWUuX3dvcmxkLnR1cmJvID0gdHJ1ZTtcbiAgICB0aGlzLmdhbWUuX3dvcmxkLnZlbG9jaXR5ID0gYy5NQVhfVkVMT0NJVFk7XG5cbiAgICB0dXJib1RpbWVyLmFkZChjLlRVUkJPX0RFTEFZLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5fd29ybGQudHVyYm8gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5nYW1lLl93b3JsZC52ZWxvY2l0eSA9IG9sZFZlbG9jaXR5O1xuICAgIH0sIHRoaXMpO1xuXG4gICAgdHVyYm9UaW1lci5zdGFydCgpO1xufTtcblxuLypcbiAqICNzbG93ZXJcbiAqL1xuXG5QcmluY2Vzcy5wcm90b3R5cGUuc2xvd2VyID0gZnVuY3Rpb24gc2xvd2VyKCkge1xuICAgIGlmICh0aGlzLmdhbWUuX3dvcmxkLnR1cmJvKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0dXJib1RpbWVyLmRlc3Ryb3koKTtcblxuICAgIG9sZFZlbG9jaXR5ID0gdGhpcy5nYW1lLl93b3JsZC52ZWxvY2l0eTtcbiAgICB0aGlzLmdhbWUuX3dvcmxkLnR1cmJvID0gdHJ1ZTtcbiAgICB0aGlzLmdhbWUuX3dvcmxkLnZlbG9jaXR5IC89IDI7XG5cbiAgICB0dXJib1RpbWVyLmFkZChjLlRVUkJPX0RFTEFZLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5fd29ybGQudHVyYm8gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5nYW1lLl93b3JsZC52ZWxvY2l0eSA9IG9sZFZlbG9jaXR5O1xuICAgIH0sIHRoaXMpO1xuXG4gICAgdHVyYm9UaW1lci5zdGFydCgpO1xufTtcblxuLypcbiAqICN1cGRhdGVcbiAqL1xuXG5QcmluY2Vzcy5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLmNoZWNrRnVlbCgpLnJlUmVuZGVyKCk7XG59O1xuXG4vKlxuICogI3JlUmVuZGVyXG4gKi9cblxuUHJpbmNlc3MucHJvdG90eXBlLnJlUmVuZGVyID0gZnVuY3Rpb24gcmVSZW5kZXIoKSB7XG4gICAgdmFyIGZhY2luZyA9IHRoaXMuX2RhdGEuZmFjaW5nO1xuXG4gICAgaWYgKGMuTEVGVCA9PT0gZmFjaW5nKSB7XG4gICAgICAgIHRoaXMuZnJhbWUgPSAxO1xuICAgIH0gZWxzZSBpZiAoYy5SSUdIVCA9PT0gZmFjaW5nKSB7XG4gICAgICAgIHRoaXMuZnJhbWUgPSAyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZnJhbWUgPSAwO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9pc0dob3N0KSB7XG4gICAgICAgIC8vIHZpc3VhbCBlZmZlY3QgZ29lcyBoZXJlXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZ2FtZS5fZGVidWcpIHtcbiAgICAgICAgdGhpcy5nYW1lLmRlYnVnLmJvZHkodGhpcyk7XG4gICAgICAgIHRoaXMuZ2FtZS5kZWJ1Zy5ib2R5SW5mbyh0aGlzLCAxMCwgMTApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLypcbiAqICNyZXN0b3JlRmFjaW5nXG4gKi9cblxuUHJpbmNlc3MucHJvdG90eXBlLnJlc3RvcmVGYWNpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmVzdG9yZUZhY2luZ1RpbWVyLmRlc3Ryb3koKTtcblxuICAgIHJlc3RvcmVGYWNpbmdUaW1lci5hZGQoYy5SRVNUT1JFX0ZBQ0lOR19ERUxBWSwgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9kYXRhLmZhY2luZyA9IGMuQ0VOVEVSO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgcmVzdG9yZUZhY2luZ1RpbWVyLnN0YXJ0KCk7XG59O1xuXG4vKlxuICogI2RhbWFnZVxuICovXG5cblByaW5jZXNzLnByb3RvdHlwZS5kYW1hZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgZ2hvc3RUaW1lci5kZXN0cm95KCk7XG5cbiAgICBnaG9zdFRpbWVyLmFkZChjLkdIT1NUX1RJTUUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5faXNHaG9zdCA9IGZhbHNlO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgdGhpcy5faXNHaG9zdCA9IHRydWU7XG4gICAgdGhpcy5jb25zdW1lRnVlbChjLkVORU1ZX0ZVRUwpO1xuXG4gICAgZ2hvc3RUaW1lci5zdGFydCgpO1xufTtcblxuLypcbiAqICNjb25zdW1lRnVlbFxuICovXG5cblByaW5jZXNzLnByb3RvdHlwZS5jb25zdW1lRnVlbCA9IGZ1bmN0aW9uIGNvbnN1bWVGdWVsKHZhbHVlKSB7XG4gICAgdGhpcy5fZGF0YS5mdWVsICs9IHZhbHVlIHx8IC0xO1xufTtcblxuLypcbiAqICNjaGVja0Z1ZWxcbiAqL1xuUHJpbmNlc3MucHJvdG90eXBlLmNoZWNrRnVlbCA9IGZ1bmN0aW9uIGNoZWNrRnVlbCgpIHtcbiAgICBpZiAodGhpcy5fZGF0YS5mdWVsIDw9IDApIHtcbiAgICAgICAgLy90aGlzLmdhbWUuZ2FtZU92ZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgY29uc29sZS5sb2coJ0dBTUUgT1ZFUicpO1xuICAgICAgICB0aGlzLmdhbWUudGltZS5ldmVudHMucmVtb3ZlKGNvbnN1bWVGdWVsVGltZXIpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qXG4gKiAjYWRkRnVlbFxuICovXG5cblByaW5jZXNzLnByb3RvdHlwZS5hZGRGdWVsID0gZnVuY3Rpb24gYWRkRnVlbChhZGRlZFZhbHVlKSB7XG4gICAgdmFyIG5ld1ZhbHVlID0gdGhpcy5fZGF0YS5mdWVsICsgYWRkZWRWYWx1ZTtcbiAgICB0aGlzLl9kYXRhLmZ1ZWwgPSBjLk1BWF9GVUVMID4gbmV3VmFsdWUgPyBuZXdWYWx1ZSA6IGMuTUFYX0ZVRUw7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cycpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgnLi4vdXRpbHMnKTtcblxuLypcbiAqICNXaW5kb3dcbiAqL1xuXG52YXIgV2luZG93ID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBXaW5kb3coZ2FtZUluc3RhbmNlLCB4LCB5KSB7XG4gICAgY29uc29sZS5hc3NlcnQoZ2FtZUluc3RhbmNlLCAnWW91IHNob3VsZCBwcm92aWRlIGEgZ2FtZUluc3RhbmNlIGluc3RhbmNlIHRvIHRoaXMgU3ByaXRlIFtXaW5kb3ddJyk7XG5cbiAgICBQaGFzZXIuU3ByaXRlLmNhbGwodGhpcywgZ2FtZUluc3RhbmNlLCB4IHx8IDAsIHkgfHwgMCwgJ2JnLXdpbmRvdycpO1xuXG4gICAgdGhpcy5yZWxvYWRGcmFtZSgpO1xuXG4gICAgZ2FtZUluc3RhbmNlLnBoeXNpY3MuYXJjYWRlLmVuYWJsZSh0aGlzKTtcbiAgICBnYW1lSW5zdGFuY2UuYWRkLmV4aXN0aW5nKHRoaXMpO1xuXG4gICAgdGhpcy5jaGVja1dvcmxkQm91bmRzID0gdHJ1ZTtcblxuICAgIHRoaXMuZXZlbnRzLm9uT3V0T2ZCb3VuZHMuYWRkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuYWxpdmUgJiYgdGhpcy5wb3NpdGlvbi55ID4gdGhpcy5nYW1lLmhlaWdodCkge1xuICAgICAgICAgICAgdGhpcy5yZXNldCh0aGlzLnBvc2l0aW9uLngsIC1jLldJTkRPV19IRUlHSFQpO1xuICAgICAgICAgICAgdGhpcy5yZWxvYWRGcmFtZSgpO1xuICAgICAgICB9XG4gICAgfSwgdGhpcyk7XG59O1xuXG5XaW5kb3cucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQaGFzZXIuU3ByaXRlLnByb3RvdHlwZSk7XG5XaW5kb3cucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gV2luZG93O1xuXG4vKlxuICogI3JlbG9hZEZyYW1lXG4gKi9cblxuV2luZG93LnByb3RvdHlwZS5yZWxvYWRGcmFtZSA9IGZ1bmN0aW9uIHJlbG9hZEZyYW1lKCkge1xuICAgIHRoaXMuZnJhbWUgPSB1dGlscy5nZXRSYW5kb21JbnRJbmNsdXNpdmUoMCwgYy5XSU5ET1dfU1BSSVRFUyk7XG59O1xuXG4vKlxuICogI3VwZGF0ZVxuICovXG5cbldpbmRvdy5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIHRoaXMuYm9keS52ZWxvY2l0eS55ID0gdGhpcy5nYW1lLl93b3JsZC52ZWxvY2l0eSAvIDI7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cycpO1xudmFyIGdlbmVyYXRvciA9IHJlcXVpcmUoJy4vd29ybGRHZW5lcmF0b3InKTtcbnZhciBpbml0aWFsRG9vcnMgPSAzO1xudmFyIGN1cnJlbnRMaW5lO1xudmFyIGluaXRpYWxWZWxvY2l0eTtcbnZhciBsaW5lU2l6ZTtcbnZhciBkb29ycztcblxudmFyIFdvcmxkID0gZnVuY3Rpb24gKHByb3BzKSB7XG4gICAgdGhpcy5zY29yZSA9IDA7XG4gICAgdGhpcy52ZWxvY2l0eSA9IDEwMDtcbiAgICB0aGlzLnR1cmJvID0gZmFsc2U7XG4gICAgaW5pdGlhbFZlbG9jaXR5ID0gdGhpcy52ZWxvY2l0eTtcblxuICAgIGxpbmVTaXplID0gcHJvcHMubGluZVNpemUgfHwgNTtcbiAgICBkb29ycyA9IHByb3BzLmRvb3JzIHx8IDI7XG5cbiAgICB0aGlzLnVwZGF0ZSgpO1xufTtcblxuV29ybGQucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnNjb3JlID0gdGhpcy5zY29yZSB8fCAwO1xuICAgIC8qKioqKiBDYWxjdWxhdGUgZG9vcnMgKioqKiovXG4gICAgZG9vcnMgPSBpbml0aWFsRG9vcnMgLSBNYXRoLmZsb29yKHRoaXMuc2NvcmUgLyA5KTtcbiAgICBkb29ycyA9IGRvb3JzID49IGxpbmVTaXplID8gbGluZVNpemUgLSAxIDogZG9vcnM7XG4gICAgaWYgKGRvb3JzIDwgMSkge1xuICAgICAgICBkb29ycyA9IDE7XG4gICAgfVxuICAgIC8qKioqKiBHZW5lcmF0ZSBuZXcgbGluZSAqKioqKi9cbiAgICBjdXJyZW50TGluZSA9IGdlbmVyYXRvci5nZW5lcmF0ZUxpbmUobGluZVNpemUsIGRvb3JzKTtcbiAgICAvKioqKiogQWRqdXN0IHZlbG9jaXR5ICoqKioqL1xuICAgIHRoaXMuc2V0VmVsb2NpdHkoKTtcblxufTtcblxuV29ybGQucHJvdG90eXBlLnNldFZlbG9jaXR5ID0gZnVuY3Rpb24gc2V0VmVsb2NpdHkoKSB7XG4gICAgaWYgKCF0aGlzLnR1cmJvKSB7XG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSB0aGlzLnZlbG9jaXR5ID49IGMuTUFYX1ZFTE9DSVRZID8gYy5NQVhfVkVMT0NJVFkgOiBpbml0aWFsVmVsb2NpdHkgKyBNYXRoLmZsb29yKHRoaXMuc2NvcmUgLyA1KSAqIDIwO1xuICAgIH1cbn07XG5cbldvcmxkLnByb3RvdHlwZS5nZXRMaW5lID0gZnVuY3Rpb24gZ2V0TGluZSgpIHtcbiAgICByZXR1cm4gY3VycmVudExpbmU7XG59O1xuXG5Xb3JsZC5wcm90b3R5cGUuYWRkU2NvcmUgPSBmdW5jdGlvbiBhZGRTY29yZShwb2ludHMpIHtcbiAgICBpZiAodHlwZW9mIHBvaW50cyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgdGhpcy5zY29yZSArPSBwb2ludHM7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBXb3JsZDtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gZ2V0UmFuZG9tSW50KG1pbiwgbWF4KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pKSArIG1pbjtcbn1cblxuZnVuY3Rpb24gZ2V0UmFuZG9tQXJyYXkoc2l6ZSwgbGltaXQpIHtcbiAgICB2YXIgcmFuZG9tQXJyYXkgPSBbXTtcbiAgICB2YXIgaWR4O1xuICAgIHZhciBhO1xuICAgIHdoaWxlIChzaXplLS0pIHtcbiAgICAgICAgYSA9IGdldFJhbmRvbUludCgwLCBsaW1pdCk7XG4gICAgICAgIGlkeCA9IHJhbmRvbUFycmF5LmluZGV4T2YoYSk7XG4gICAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAgICAgc2l6ZSsrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmFuZG9tQXJyYXkucHVzaChhKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmFuZG9tQXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdlbmVyYXRlTGluZTogZnVuY3Rpb24gKHNpemUsIGRvb3JzKSB7XG4gICAgICAgIHZhciBsaW5lID0gW107XG4gICAgICAgIHZhciBpZHg7XG4gICAgICAgIGRvb3JzID0gZ2V0UmFuZG9tQXJyYXkoZG9vcnMsIHNpemUpO1xuXG4gICAgICAgIHdoaWxlIChzaXplLS0pIHtcbiAgICAgICAgICAgIGlkeCA9IGRvb3JzLmluZGV4T2Yoc2l6ZSk7XG4gICAgICAgICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgICAgICAgICBsaW5lLnB1c2goMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpbmUucHVzaCgxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaW5lO1xuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjZmcgPSByZXF1aXJlKCcuLi8uLi8uLi9jb25maWcnKTtcblxudmFyIEJvb3QgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBQaGFzZXIuU3RhdGUuY2FsbCh0aGlzKTtcbn07XG5Cb290LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoUGhhc2VyLlN0YXRlLnByb3RvdHlwZSk7XG5Cb290LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEJvb3Q7XG5cbkJvb3QucHJvdG90eXBlLnByZWxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5sb2FkLmJhc2VVUkwgPSAnLi9hc3NldHMvJztcbn07XG5cbkJvb3QucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTEw7XG4gICAgdGhpcy5zY2FsZS5taW5XaWR0aCA9IGNmZy53aWR0aDtcbiAgICB0aGlzLnNjYWxlLm1pbkhlaWdodCA9IGNmZy5oZWlnaHQ7XG4gICAgdGhpcy5zY2FsZS5wYWdlQWxpZ25Ib3Jpem9udGFsbHkgPSB0cnVlO1xuICAgIHRoaXMuc2NhbGUucGFnZUFsaWduVmVydGljYWxseSA9IHRydWU7XG4gICAgdGhpcy5zY2FsZS51cGRhdGVMYXlvdXQodHJ1ZSk7XG4gICAgdGhpcy5zdGFnZS5zbW9vdGhlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5zdGF0ZS5zdGFydCgncHJlbG9hZGVyJyk7XG5cbiAgICB0aGlzLmdhbWUuX2RlYnVnID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5yZXBsYWNlKCc/JywgJycpID09PSAnZGVidWcnO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIE1lbnUgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgUGhhc2VyLlN0YXRlLmNhbGwodGhpcyk7XG59O1xuTWVudS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBoYXNlci5TdGF0ZS5wcm90b3R5cGUpO1xuTWVudS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBNZW51O1xuXG5NZW51LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBsYWJlbFN0eWxlID0ge2FsaWduOiAnY2VudGVyJywgZmlsbDogJyNmZmZmZmYnLCBmb250OiAnMTVweCBBcmlhbCd9O1xuICB2YXIgdGl0bGVTdHlsZSA9IHthbGlnbjogJ2NlbnRlcicsIGZpbGw6ICcjZmZmZmZmJywgZm9udDogJ2JvbGQgNDVweCBBcmlhbCd9O1xuICB2YXIgdGV4dCwgdGl0bGU7XG5cbiAgaWYgKHRoaXMuZ2FtZS5kZXZpY2UuZGVza3RvcCkge1xuICAgIHRleHQgPSAnQ2xpY2sgdG8gc3RhcnQnO1xuICB9IGVsc2Uge1xuICAgIHRleHQgPSAnVG91Y2ggdG8gc3RhcnQnO1xuICB9XG5cbiAgdGl0bGUgPSB0aGlzLmFkZFxuICAgIC50ZXh0KHRoaXMud29ybGQuY2VudGVyWCwgMCwgJ0RlbW8gUHJvamVjdCcsIHRpdGxlU3R5bGUpXG4gICAgLmFuY2hvci5zZXRUbygwLjUpO1xuXG4gIHRoaXMuYWRkXG4gICAgLnRleHQodGhpcy53b3JsZC5jZW50ZXJYLCAxNTAsICdNZW51IFNjcmVlbicsIHtmaWxsOiAnI2ZmZid9KVxuICAgIC5hbmNob3Iuc2V0KDAuNSk7XG5cbiAgdGhpcy5hZGRcbiAgICAudGV4dCh0aGlzLndvcmxkLmNlbnRlclgsIHRoaXMud29ybGQuaGVpZ2h0IC0gMTUwLCB0ZXh0LCBsYWJlbFN0eWxlKVxuICAgIC5hbmNob3Iuc2V0KDAuNSk7XG5cbiAgdGhpcy5hZGQudHdlZW4odGl0bGUpXG4gICAgLnRvKHt5OiAtMX0pXG4gICAgLnN0YXJ0KCk7XG5cbiAgdGhpcy5pbnB1dC5vbkRvd24uYWRkKHRoaXMuc3RhcnRHYW1lLCB0aGlzKTtcbn07XG5cbk1lbnUucHJvdG90eXBlLnN0YXJ0R2FtZSA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5zdGF0ZS5zdGFydCgncGxheScpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbnZhciBQcmluY2VzcyA9IHJlcXVpcmUoJy4uL3ByZWZhYnMvcHJpbmNlc3MnKTtcbnZhciBFbmVteSA9IHJlcXVpcmUoJy4uL3ByZWZhYnMvZW5lbXknKTtcbnZhciBXb3JsZCA9IHJlcXVpcmUoJy4uL3ByZWZhYnMvd29ybGQnKTtcbnZhciBXaW5kb3cgPSByZXF1aXJlKCcuLi9wcmVmYWJzL3dpbmRvdycpO1xuXG52YXIgUGxheSA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICAgIFBoYXNlci5TdGF0ZS5jYWxsKHRoaXMpO1xufTtcblxuUGxheS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBoYXNlci5TdGF0ZS5wcm90b3R5cGUpO1xuUGxheS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBQbGF5O1xuXG52YXIgcHJpbmNlc3M7XG52YXIgYmdTa3k7XG52YXIgY3Vyc29ycztcbnZhciBlbmVteUdyb3VwO1xudmFyIGVuZW1pZXNQZXJMaW5lO1xudmFyIGNhc3RsZUJnO1xudmFyIHdpbmRvd0JnO1xudmFyIGZ1ZWxDb250YWluZXI7XG52YXIgZnVlbEJhcjtcbnZhciBjcm9wUmVjdDtcbnZhciBmdWVsTWF4VztcbnZhciBlbmVteUNyZWF0aW9uVGltZXI7XG5cblBsYXkucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZ2FtZSA9IHRoaXMuZ2FtZTtcblxuICAgIC8vIGdhbWVcblxuICAgIGlmIChnYW1lLl9kZWJ1Zykge1xuICAgICAgICBnYW1lLnN0YWdlLmRpc2FibGVWaXNpYmlsaXR5Q2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgZ2FtZS5kZWJ1Zy5zdGFydCgpO1xuICAgIH1cblxuICAgIGdhbWUucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5BUkNBREUpO1xuICAgIGdhbWUucGh5c2ljcy5zZXRCb3VuZHNUb1dvcmxkKCk7XG5cbiAgICBlbmVtaWVzUGVyTGluZSA9IE1hdGguY2VpbCh0aGlzLmdhbWUud2lkdGggLyAxNTApO1xuICAgIGVuZW1pZXNQZXJMaW5lID0gZW5lbWllc1BlckxpbmUgPCAzID8gMyA6IGVuZW1pZXNQZXJMaW5lO1xuXG4gICAgZ2FtZS5fd29ybGQgPSBuZXcgV29ybGQoe1xuICAgICAgICBsaW5lU2l6ZTogZW5lbWllc1BlckxpbmVcbiAgICB9KTtcblxuICAgIC8vIGJnXG5cbiAgICBiZ1NreSA9IGdhbWUuYWRkLnRpbGVTcHJpdGUoMCwgMCwgZ2FtZS53b3JsZC53aWR0aCwgZ2FtZS53b3JsZC5oZWlnaHQsICdiZy1za3knKTtcbiAgICBjYXN0bGVCZyA9IGdhbWUuYWRkLnRpbGVTcHJpdGUoZ2FtZS53b3JsZC53aWR0aCAvIDIgLSBjLkNBU1RMRV9XSURUSCAvIDIsIDAsIGMuQ0FTVExFX1dJRFRILCBnYW1lLndvcmxkLmhlaWdodCwgJ2JnLWNhc3RsZScpO1xuICAgIGdhbWUucGh5c2ljcy5lbmFibGUoY2FzdGxlQmcsIFBoYXNlci5QaHlzaWNzLkFSQ0FERSk7XG5cbiAgICB3aW5kb3dCZyA9IG5ldyBXaW5kb3coZ2FtZSwgZ2FtZS53b3JsZC53aWR0aCAvIDIgLSBjLldJTkRPV19XSURUSCAvIDIsIC1jLldJTkRPV19IRUlHSFQpO1xuXG4gICAgLy8gVUlcbiAgICAvLyAzMCwgNSBpcyB0aGUgZGlmZiBmb3IgdGhlIGNvbnRhaW5lciBpbnRvIHRoZSBmaXJzdCBweCB0byByZW5kZXIgdGhlIGJhci5cbiAgICB2YXIgZnVlbENvbnRhaW5lclggPSAxMDtcbiAgICB2YXIgZnVlbENvbnRhaW5lclkgPSAxNTtcbiAgICB2YXIgZnVlbEJhclggPSA0MDtcbiAgICB2YXIgZnVlbEJhclkgPSAyMDtcbiAgICB2YXIgc2NvcmVUZXh0WCA9IDEwO1xuICAgIHZhciBzY29yZVRleHRZID0gNjA7XG5cbiAgICBmdWVsQ29udGFpbmVyID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoZnVlbENvbnRhaW5lclgsIGZ1ZWxDb250YWluZXJZLCAnZnVlbF9jb250YWluZXInKTtcbiAgICBmdWVsQmFyID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoZnVlbEJhclgsIGZ1ZWxCYXJZLCAnZnVlbCcpO1xuXG4gICAgY3JvcFJlY3QgPSBuZXcgUGhhc2VyLlJlY3RhbmdsZSgwLCAwLCBmdWVsQmFyLndpZHRoLCBmdWVsQmFyLmhlaWdodCk7XG4gICAgZnVlbE1heFcgPSBmdWVsQmFyLndpZHRoO1xuICAgIGZ1ZWxCYXIuY3JvcChjcm9wUmVjdCk7XG5cbiAgICB0aGlzLnNjb3JlVGV4dCA9IHRoaXMuZ2FtZS5hZGQuYml0bWFwVGV4dChzY29yZVRleHRYICsgMTIwLCBzY29yZVRleHRZLCAnc2NvcmVGb250JywgJzAnLCAyNCk7XG4gICAgdGhpcy5zY29yZVRleHQuc21vb3RoZWQgPSBmYWxzZTtcbiAgICB0aGlzLmdhbWUuYWRkLmJpdG1hcFRleHQoc2NvcmVUZXh0WCwgc2NvcmVUZXh0WSwgJ3Njb3JlRm9udCcsICdzY29yZTonLCAxNik7XG5cbiAgICAvLyBwbGF5ZXJcblxuICAgIHByaW5jZXNzID0gbmV3IFByaW5jZXNzKGdhbWUsIGdhbWUud29ybGQuY2VudGVyWCwgZ2FtZS5oZWlnaHQgLSBjLlBSSU5DRVNTX0hFSUdIVCwgMCk7XG5cbiAgICBjdXJzb3JzID0gZ2FtZS5pbnB1dC5rZXlib2FyZC5jcmVhdGVDdXJzb3JLZXlzKCk7XG5cbiAgICAvLyBlbmVtaWVzXG5cbiAgICBlbmVteUdyb3VwID0gZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICBlbmVteUNyZWF0aW9uVGltZXIgPSBnYW1lLnRpbWUuZXZlbnRzLmxvb3AoYy5FTkVNWV9TUEFXTl9ERUxBWSwgdGhpcy5jcmVhdGVFbmVtaWVzLCB0aGlzKTtcbn07XG5cblBsYXkucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBiZ1xuXG4gICAgYmdTa3kudGlsZVBvc2l0aW9uLnkgKz0gdGhpcy5nYW1lLl93b3JsZC52ZWxvY2l0eSAvIDIwMDtcblxuICAgIGNhc3RsZUJnLnRpbGVQb3NpdGlvbi55ICs9IHRoaXMuZ2FtZS5fd29ybGQudmVsb2NpdHkgLyAxMjA7XG5cbiAgICB3aW5kb3dCZy51cGRhdGUoKTtcblxuICAgIC8vIGNvbnRyb2xzXG5cbiAgICBpZiAoY3Vyc29ycy51cC5pc0Rvd24pIHtcbiAgICAgICAgcHJpbmNlc3MuZmFzdGVyKCk7XG4gICAgfSBlbHNlIGlmIChjdXJzb3JzLmRvd24uaXNEb3duKSB7XG4gICAgICAgIHByaW5jZXNzLnNsb3dlcigpO1xuICAgIH1cblxuICAgIGlmIChjdXJzb3JzLmxlZnQuaXNEb3duKSB7XG4gICAgICAgIHByaW5jZXNzLm1vdmUoYy5MRUZUKTtcbiAgICB9IGVsc2UgaWYgKGN1cnNvcnMucmlnaHQuaXNEb3duKSB7XG4gICAgICAgIHByaW5jZXNzLm1vdmUoYy5SSUdIVCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcHJpbmNlc3MubW92ZSgpO1xuICAgIH1cblxuICAgIC8vIGdhbWUgY29udHJvbFxuXG4gICAgdGhpcy5waHlzaWNzLmFyY2FkZS5vdmVybGFwKHByaW5jZXNzLCBlbmVteUdyb3VwLCBmdW5jdGlvbiAoc2VsZiwgZW5lbXkpIHtcbiAgICAgICAgaWYgKCFzZWxmLl9pc0dob3N0KSB7XG4gICAgICAgICAgICBlbmVteS5raWxsKCk7XG4gICAgICAgICAgICBzZWxmLmRhbWFnZSgpO1xuICAgICAgICB9XG4gICAgfSwgbnVsbCwgdGhpcyk7XG5cbiAgICBwcmluY2Vzcy51cGRhdGUoKTtcblxuICAgIGNyb3BSZWN0LndpZHRoID0gKHByaW5jZXNzLl9kYXRhLmZ1ZWwgLyBjLk1BWF9GVUVMKSAqIGZ1ZWxNYXhXO1xuICAgIGZ1ZWxCYXIudXBkYXRlQ3JvcCgpO1xuXG4gICAgLy8gZW5lbWllc1xuXG4gICAgZW5lbXlHcm91cC5mb3JFYWNoKGZ1bmN0aW9uIChlbmVteSkge1xuICAgICAgICBlbmVteS51cGRhdGUoKTtcbiAgICB9KTtcblxuICAgIC8vIHNjb3JpbmdcblxuICAgIC8vIGVuZW15IGNyZWF0aW5nIGRlbGF5IGZvbGxvd3MgdGhlIGVxdWF0aW9uIFggPSBZICogMC41ICsgMjAwIC8gWSAqIDEyMDAgd2hlcmUgWSBpcyB0aGUgd29ybGQncyB2ZWxvY2l0eVxuICAgIGVuZW15Q3JlYXRpb25UaW1lci5kZWxheSA9IHRoaXMuZ2FtZS5fd29ybGQudmVsb2NpdHkgKiAwLjUgKyAyMDAgLyB0aGlzLmdhbWUuX3dvcmxkLnZlbG9jaXR5ICogMTIwMDtcblxuICAgIHRoaXMuZ2FtZS5fd29ybGQuc2V0VmVsb2NpdHkoKTtcbiAgICB0aGlzLnNjb3JlVGV4dC50ZXh0ID0gdGhpcy5nYW1lLl93b3JsZC5zY29yZTtcblxuICAgIC8vIGRlYnVnXG5cbiAgICBpZiAodGhpcy5nYW1lLl9kZWJ1Zykge1xuICAgICAgICBjb25zb2xlLmxvZygnZW5lbWllcyBjcmVhdGVkOiAnLCBlbmVteUdyb3VwLmxlbmd0aCk7XG4gICAgfVxufTtcblxuUGxheS5wcm90b3R5cGUuY3JlYXRlRW5lbWllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZ2FtZSA9IHRoaXMuZ2FtZSxcbiAgICAgICAgbGluZSA9IHRoaXMuZ2FtZS5fd29ybGQuZ2V0TGluZSgpLFxuICAgICAgICBlbmVteTsgLy90aGUgZW5lbXkgKFNwcml0ZSkgdG8gYmUgYWRkZWQuXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGxpbmVbaV0gPT09IDApIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZW5lbXkgPSBlbmVteUdyb3VwLmdldEZpcnN0RXhpc3RzKGZhbHNlKTtcblxuICAgICAgICBpZiAoIWVuZW15KSB7XG4gICAgICAgICAgICBlbmVteSA9IG5ldyBFbmVteShnYW1lKTtcbiAgICAgICAgICAgIGVuZW15R3JvdXAuYWRkKGVuZW15KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVuZW15LnJldml2ZSgpO1xuICAgICAgICBlbmVteS5yZXNldChpICogMTQwICsgNDAsIC0xNTApO1xuICAgIH1cblxuICAgIHRoaXMuZ2FtZS5fd29ybGQudXBkYXRlKCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cycpO1xuXG52YXIgUHJlbG9hZGVyID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgUGhhc2VyLlN0YXRlLmNhbGwodGhpcyk7XG59O1xuXG5QcmVsb2FkZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQaGFzZXIuU3RhdGUucHJvdG90eXBlKTtcblByZWxvYWRlci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBQcmVsb2FkZXI7XG5cblByZWxvYWRlci5wcm90b3R5cGUucHJlbG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbG9hZCA9IHRoaXMubG9hZDtcblxuICAgIHRoaXMubG9hZC5iaXRtYXBGb250KCdzY29yZUZvbnQnLCAnZm9udHMvYml0bWFwRm9udHMvY2Fycmllcl9jb21tYW5kLnBuZycsICdmb250cy9iaXRtYXBGb250cy9jYXJyaWVyX2NvbW1hbmQueG1sJyk7XG5cbiAgICBsb2FkLmltYWdlKCdiZy1za3knLCAnc2t5LnBuZycpO1xuICAgIGxvYWQuaW1hZ2UoJ2JnLWNhc3RsZScsICdjYXN0bGUucG5nJyk7XG4gICAgbG9hZC5pbWFnZSgnZnVlbF9jb250YWluZXInLCAnZnVlbGJhci5wbmcnKTtcbiAgICBsb2FkLmltYWdlKCdmdWVsJywgJ2Z1ZWxiYXItZmlsbC5wbmcnKTtcbiAgICBsb2FkLnNwcml0ZXNoZWV0KCdiZy13aW5kb3cnLCAnd2luZG93LnBuZycsIGMuV0lORE9XX1dJRFRILCBjLldJTkRPV19IRUlHSFQsIGMuV0lORE9XX1NQUklURVMpO1xuICAgIGxvYWQuc3ByaXRlc2hlZXQoJ3ByaW5jZXNzJywgJ3ByaW5jZXNzLnBuZycsIGMuUFJJTkNFU1NfV0lEVEgsIGMuUFJJTkNFU1NfSEVJR0hULCBjLlBSSU5DRVNTX1NQUklURVMpO1xuICAgIGxvYWQuc3ByaXRlc2hlZXQoJ2x1bWJlcmphY2snLCAnbHVtYmVyamFjay5wbmcnLCBjLkxVTUJFUkpBQ0tfV0lEVEgsIGMuTFVNQkVSSkFDS19IRUlHSFQsIGMuTFVNQkVSSkFDS19TUFJJVEVTKTtcbiAgICBsb2FkLnNwcml0ZXNoZWV0KCd3b2xmJywgJ3dvbGYucG5nJywgYy5XT0xGX1dJRFRILCBjLldPTEZfSEVJR0hULCBjLldPTEZfU1BSSVRFUyk7XG59O1xuXG5QcmVsb2FkZXIucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnN0YXRlLnN0YXJ0KCdwbGF5Jyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKlxuICogdXRpbHMuanNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZXRSYW5kb21JbnRJbmNsdXNpdmU6IGZ1bmN0aW9uIChtaW4sIG1heCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcbiAgICB9XG59OyJdfQ==
