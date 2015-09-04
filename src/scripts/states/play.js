/*globals require, Phaser*/

var Princess = require('../entities/princess');
var World = require('../entities/world');
var c = require('../constants');
var SoundsManager = require('../sounds');
var PrincessSettings = require('../partials/princess_settings');
var cursors,
    cheeseGroup,
    enemyGroup,
    princess,
    fuelContainer,
    fuelBar,
    cheese,
    rottenCheese,
    SM,
    cropRect,
    fuelMaxW,
    enemiesPerLine,
    windowSprite,
    pauseButton;

var play = function (game) {
};

play.prototype = {
    preload: preload,
    create: create,
    update: update,
    createEnemies: createEnemies,
    updateEnemies: updateEnemies,
    checkInputs: checkInputs,
    activeCheese: null,
    princessSettings: false
};

function preload() {
    // This should be empty. To load something please use preloader.js
}

function createCheeses() {
    var game = this.game, newX = 0;
    cheese = cheeseGroup.create(0, -100, 'cheese');
    cheese.scale.set(0.5, 0.5);

    rottenCheese = cheeseGroup.create(0, -100, 'rotten-cheese');
    rottenCheese.scale.set(0.5, 0.5);
    newX = Math.floor(Math.random() * (this.game.width - cheese.width));
    cheese.x = newX;
    rottenCheese.x = newX;
    game.physics.arcade.enable(cheese);
    game.physics.arcade.enable(rottenCheese);
    cheese.name = 'fuel-up';
    cheese.fuel = c.CHEESE_FUEL;
    cheese.body.velocity.y = 0;
    rottenCheese.body.velocity.y = 0;
    rottenCheese.name = 'fuel-down';
    rottenCheese.fuel = -1 * (c.CHEESE_FUEL / 2);
    this.activeCheese = null;
}
function getRandomWindowKey(){
    var randomWindow = Math.round(Math.random()*4),
        windowsSprites = c.SPRITES.WINDOWS;

    return windowsSprites[randomWindow] ||  windowsSprites[0];
}
function repaintWindow(lWindow){
    var key;
    do {
        //Make sure we don't repeat same window?
        key = getRandomWindowKey();
    }while(key === lWindow.key);
    lWindow.loadTexture(key);
    //Put it 0 to 4 times the height above the screen. +1 to prevent render on y (over the sreen) when 0.
    lWindow.y = - ( ( Math.round(Math.random() * 4) + 1 ) * lWindow.height ) ;
}
function createWindow(){
    var game = this.game,
        key = getRandomWindowKey(),
        x;
    windowSprite = game.add.sprite(0,0, key);
    x = this.game.width/2 - windowSprite.width/2;
    windowSprite.x = x;
    windowSprite.y = 0;
    game.physics.arcade.enable(windowSprite);
    windowSprite.body.velocity.y = 0;
    return windowSprite;
}
function nullifySettings(){
    //>_> WHY THE FCK THIS IS NEEDED? It is not being re rendered and it is not being restarted, this is a hack )-:
    this.princessSettings = null;
}

function create() {
    var that = this, tileSize = 0, tilesCount = 0;
    nullifySettings.apply(this);

    enemiesPerLine = Math.ceil(this.game.width / 180);
    enemiesPerLine = enemiesPerLine < 3 ? 3 : enemiesPerLine;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game._debug = false;
    this.game._my_world = new World({
        lineSize: enemiesPerLine
    });

//    console.log(this.game.world.width);
    //TODO: Mover el bg a world.js/Background.js ?
    this._bg = [];
//    this._clouds = [];
//    this._creepers = [];
    //Adding the clouds
    tilesCount = 2;
    var tile, i;
    for (i = 0; i < tilesCount; i++) {
        //                                      x                                   ,y         , width   , height  , sprite-name
        tile = this.game.add.tileSprite(0, i * this.game.height, this.game.width, this.game.height, 'clouds');
        tile._tileSpeed = c.SPEED.TILE;
        this._bg.push(tile);
    }
    tileSize = 320;
    tilesCount = parseInt(this.game.world.height / tileSize) + 1;
    for (i = 0; i < tilesCount; i++) {
        //                                      x                                   ,y         , width   , height  , sprite-name
        this._bg.push(this.game.add.tileSprite(this.game.world.centerX - tileSize / 2, i * tileSize, tileSize, tileSize, 'background'));
    }
    //Adding the creepers
    tileSize = 80;
    tilesCount = parseInt(this.game.world.height / tileSize) + 1;
    for (i = 0; i < tilesCount; i++) {
        this._bg.push(this.game.add.tileSprite(this.game.world.centerX - 320 / 2 - 2, i * tileSize, tileSize, tileSize, 'creeperL'));
    }
    for (i = 0; i < tilesCount; i++) {
        this._bg.push(this.game.add.tileSprite(this.game.world.centerX + 320 / 2 + 2 - tileSize, i * tileSize, tileSize, tileSize, 'creeperR'));
    }

    createWindow.apply(this); // Add after bgs but before other entities

    cheeseGroup = this.game.add.group();
    cheeseGroup.enableBody = true;
    createCheeses.call(this);

    enemyGroup = this.game.add.group();
    enemyGroup.enableBody = true;

    princess = new Princess(this.game, this.game.world.centerX, this.game.height - c.PRINCESS_HEIGHT, 0);

    princess.registerCollision(enemyGroup, function princessCollisionsWithEnemy(that, enemy) {
        if (princess._canBeHurt) {
            SM.play(SM.SOUNDS.HIT);
            enemy.kill();
            enemyGroup.remove(enemy);
            that._data.fuel += c.ENEMY_FUEL;
            princess._noChoqueMeChocaron();
        }
    });

    princess.registerCollision(cheeseGroup, function princessCollisionsWithCheese(that, cheese) {
        if (cheese.fuel > 0) {
            SM.play(SM.SOUNDS.CHEESE);
        } else {
            SM.play(SM.SOUNDS.ROTTEN_CHEESE);
        }

        that.addFuel(cheese.fuel);
        that.score += Math.floor(cheese.fuel / 2);

        resetCheese.call(that, cheese);
    });

    /** UI Elements **/

    var pauseButtonX = this.game.width - 62;
    var pauseButtonY = 10;
    // 30, 5 is the diff for the container into the first px to render the bar.
    var fuelContainerX = 10;
    var fuelContainerY = 15;
    var fuelBarX = 40;
    var fuelBarY = 20;
    var scoreTextX = 10;
    var scoreTextY = 60;

    pauseButton = this.game.add.sprite(pauseButtonX, pauseButtonY, c.BUTTONS.PAUSE);
    pauseButton.scale.set(2, 2);
    pauseButton.inputEnabled = true;
    pauseButton.input.useHandCursor = true; //if you want a hand cursor
    pauseButton.events.onInputDown.add(pause, this);

    this.scoreText = this.game.add.bitmapText(scoreTextX + 120, scoreTextY, 'scoreFont', this.game._my_world.score, 24);
    this.game.add.bitmapText(scoreTextX, scoreTextY, 'scoreFont', 'score:', 16);

    fuelContainer = this.game.add.sprite(fuelContainerX, fuelContainerY, 'fuel_container');
    fuelBar = this.game.add.sprite(fuelBarX, fuelBarY, 'fuel');

    /** End UI Elements **/

    cropRect = new Phaser.Rectangle(0, 0, fuelBar.width, fuelBar.height);
    fuelMaxW = fuelBar.width;
    fuelBar.crop(cropRect);
    this.createEnemies();

    addScore.call(this, 0);

    if (this.game._debug) {
        this.game.stage.disableVisibilityChange = true;
        this.game.debug.start();
    }

    this.game.stage.backgroundColor = '#39c7fc';

    this.game.turbo = 2;

    cursors = this.game.input.keyboard.createCursorKeys();

    this.game.touchControl = this.game.plugins.add(Phaser.Plugin.TouchControl);
    this.game.touchControl.inputEnable(0, 0, this.stage.width, this.stage.height);
    this.game.touchControl.settings.maxDistanceInPixels = 100;
    this.game.touchControl.settings.singleDirection = true;

    this.game.touchControl.imageGroup.forEach(function (e) {
        e.scale.setTo(0.75, 0.75);
    });

    var escKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    escKey.onDown.add(shiftPause, this);

    // Add a input listener that can help us return from being paused
    this.game.input.onDown.add(unpause, this);

    SM = new SoundsManager(this.game);
    function gameOver() {
        SM.stop(SM.SOUNDS.BACKGROUND);
        SM.play(SM.SOUNDS.DIES);
        this.game.state.start(c.STATES.gameOver, true, false, this);
        return;
    }

    this.game.gameOver = gameOver;

    SM.create();
    SM.play(SM.SOUNDS.START);
    SM.play(SM.SOUNDS.BACKGROUND, true);
}

function addScore(points) {
    this.game._my_world.score += points;
    this.scoreText.text = this.game._my_world.score;
}

function updateEnemies() {
    var game = this.game, enemies = enemyGroup.children;
    for (var i = 0; i < enemies.length; i++) {

        var velocity = this.game._my_world.velocity * this.game.turbo;
        enemies[i].body.velocity.y = velocity < c.MAX_VELOCITY ? velocity : c.MAX_VELOCITY;

        if (enemies[i].position.y > princess.position.y && !enemies[i].disabled) {
            addScore.call(this, 1);
            enemies[i].disabled = true;
        }

        if (enemies[i].body.y > game.height) {
            enemies[i].disabled = false;
            enemyGroup.remove(enemies[i], true, true);
        }
    }

    if (!enemyGroup.length) {
        this.createEnemies();
    }
    else {
        var lastEnemy = enemyGroup.children[enemyGroup.children.length - 1];
        if (lastEnemy.body.y > lastEnemy.body.height * 6) {
            this.createEnemies();
        }
    }
}

// TODO - Refactor this - this should be on princess.js -__-
var timers = {};
var canTurbo = true;

function checkInputs() {
    var that = this;

    if (canTurbo && (cursors.up.isDown || c.SLIDE_DISTANCE < this.game.touchControl.speed.y)) {
        timers.turbo = setTimeout(function () {
            that.game.turbo = 2;
            canTurbo = true;
        }, c.TURBO_DELAY);
        this.game.turbo = 6;
        canTurbo = false;
    }
    else if (canTurbo && (cursors.down.isDown || -c.SLIDE_DISTANCE > this.game.touchControl.speed.y)) {
        timers.turbo = setTimeout(function () {
            that.game.turbo = 2;
            canTurbo = true;
        }, c.TURBO_DELAY);
        this.game.turbo = 1;
        canTurbo = false;
    }

    if (cursors.left.isDown || c.SLIDE_DISTANCE < this.game.touchControl.speed.x) {
        princess.move(c.LEFT);
    } else if (cursors.right.isDown || -c.SLIDE_DISTANCE > this.game.touchControl.speed.x) {
        princess.move(c.RIGHT);
    } else {
        princess.move(false);
    }
}

function resetCheese(currentCheese) {
    var newX =  Math.floor(Math.random() * this.game.width);
    currentCheese.y = -100 - 10 * Math.floor(Math.random() * 10);
    currentCheese.x = newX;
    currentCheese.body.velocity.y = 0;
    this.activeCheese = null;
}
function updateCheeses() {
    var currentCheese = this.activeCheese, game = this.game, nextCheese = 0, newX;

    if (currentCheese) {
        if (currentCheese.body) {
            currentCheese.body.velocity.y = 100 * this.game.turbo;
        } else {
            //Somehow it is getting null bodies, maybe end of the game or after collide detection ):
            return;
        }
        if (currentCheese.body.y > this.game.height) {
            //Cheese lost.
            resetCheese.call(this, currentCheese);
        }
    } else {
        nextCheese = Math.floor(Math.random() * this.game._my_world.score);
        if (nextCheese < 10 || nextCheese < this.game._my_world.score * .30) {
            this.activeCheese = cheese;
        } else {
            this.activeCheese = rottenCheese;
        }
        newX = Math.floor(Math.random() * this.game.width) + 1;
        if (newX + this.activeCheese.width > this.game.width) {
            newX = this.game.width - this.activeCheese.width;
        }
        this.activeCheese.body.x = newX;
        this.activeCheese.alive = true;
        this.activeCheese.visible = true;
    }
}
function updateEntities() {
    updateEnemies.call(this);
    updateCheeses.call(this);
    updateWindow.call(this);
}
    function updateWindow(){
        if (windowSprite.body.y > this.game.height) {
            //Cheese lost.
            repaintWindow.call(this, windowSprite);
        }
    }

function update() {
    var velocity = parseInt(this.game._my_world.velocity / 50), tile;

    if (this.game.turbo == 4) {
        velocity += velocity;
    }
    for (var i = 0, len = this._bg.length; i < len; i++) {
        //_tileSpeed
        tile = this._bg[i];
        if (tile._tileSpeed) {
            tile.tilePosition.y += tile._tileSpeed;
        } else {
            tile.tilePosition.y += velocity;
        }
    }
    windowSprite.y += velocity;

    this.game._my_world.update();
    updateEntities.call(this);

    this.checkInputs();
    princess.update();
    cropRect.width = (princess._data.fuel / c.MAX_FUEL) * fuelMaxW;
    fuelBar.updateCrop();

    if (this.game._debug) {
        enemyGroup.forEachAlive(function (member) {
            this.game.debug.body(member);
        }, this);
    }
}

function createEnemies() {
    var game = this.game,
        line = this.game._my_world.getLine(),
        isWolf, enemySpriteName, x, //generated X
        enemy; //the enemy (Sprite) to be added.

    for (var i = 0; i < line.length; i++) {
        if (line[i] === 0) {
            continue;
        }

        isWolf = getRandom(0, 3) === 0;
        enemySpriteName = isWolf ? 'wolf' : 'lumberjack';

        x = generateXForEnemy(i, game);
        enemy = game.add.sprite(x, -100, enemySpriteName);
        //enemyGroup.create(x, -100, enemySpriteName);
        enemy.animations.add('idle');
        enemy.animations.play('idle', 30, true);
        enemyGroup.add(enemy);
        enemy.scale.set(.7, .7);
        enemy.body.velocity.y = 100;
    }
}

function generateXForEnemy(index, game) {
    return index * (15 + game.width / enemiesPerLine);
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showSettings(){
    var princessSettings = this.princessSettings;
    if(!princessSettings){
        //This is not being reached on restart, it works on gameover + start, but no with restart ):
        princessSettings = this.princessSettings = new PrincessSettings(this.game);
    }
    princessSettings.show();
}

function hideSettings(){
    var princessSettings = this.princessSettings;
    princessSettings.hide();
}

function pause() {
    if (!this.game.paused) {
        this.game.paused = true;
        pauseButton.loadTexture('playButton');
        showSettings.call(this);
    }
}
function localCollides(event, sprite){
    var x = event.x,
        y = event.y;
    return x >= sprite.x && x <= (sprite.x + sprite.width) && y >= sprite.y && y <= sprite.y + sprite.height;
}
function unpause(event) {
    var unpaused = false;
    if (this.game.paused) {
        if(event){
            //Coming from clicking the pause button (sends events)
            if(localCollides(event, pauseButton)){
                unpaused = true;
            }
        } else {
            //Coming from ESC or any other event
            unpaused = true;
        }
        if(unpaused){
            this.game.paused = false;
            pauseButton.loadTexture(c.BUTTONS.PAUSE);
            hideSettings.call(this);
        }
    }
}

function shiftPause() {
    if (!this.game.paused) {
        pause.apply(this);
    }
    else {
        unpause.apply(this);
    }
}

module.exports = play;
