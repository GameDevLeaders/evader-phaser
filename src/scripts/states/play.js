var Princess = require('../entities/princess');
var World = require('../entities/world');
var c = require('../constants');
var SoundsManager = require('../sounds');

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
    enemiesPerLine;

var play = function(game) {};

play.prototype = {
    preload: function () {
        var game = this.game;

        // Loading...
        this.game.add.bitmapText(game.world.centerX - 50, game.world.centerY, 'scoreFont', 'Loading...', 12);

        //sprites
        this.game.load.image('compass', 'assets/nothing.png');
        this.game.load.image('touch_segment', 'assets/nothing.png');
        this.game.load.image('touch', 'assets/nothing.png');
        this.game.load.spritesheet('princess', 'assets/sprites/princess.png', c.PRINCESS_WIDTH,  c.PRINCESS_HEIGHT, c.PRINCESS_SPRITES);
        this.game.load.spritesheet('lumberjack', 'assets/sprites/lumberjack-s.png', c.LUMBERJACK_WIDTH,  c.LUMBERJACK_HEIGHT, c.LUMBERJACK_SPRITES);
        this.game.load.spritesheet('wolf', 'assets/sprites/wolf.png', c.WOLF_WIDTH,  c.WOLF_HEIGHT, c.WOLF_SPRITES);
        this.game.load.image('princess_center', 'assets/sprites/princess-back.png');
        this.game.load.image('princess_left', 'assets/sprites/princess-side.png');
        this.game.load.image('fuel_container', 'assets/sprites/fuelbar.png');
        this.game.load.image('fuel', 'assets/sprites/fuelbar-fill.png');
        this.game.load.image('cheese', 'assets/sprites/cheese.png');
        this.game.load.image('rotten-cheese', 'assets/sprites/rottencheese.png');
        this.game.load.image("background", "assets/sprites/castle-texture.png");
        this.game.load.image("clouds", "assets/sprites/sky.png");
        this.game.load.image("creeperL", "assets/sprites/enredadera-izq.png");
        this.game.load.image("creeperR", "assets/sprites/enredadera-der.png");
        this.game.load.bitmapFont('scoreFont', 'assets/fonts/bitmapFonts/carrier_command.png', 'assets/fonts/bitmapFonts/carrier_command.xml');

        this.game.load.image('fire1', 'assets/fire1.png');
        this.game.load.image('fire2', 'assets/fire2.png');
        this.game.load.image('fire3', 'assets/fire3.png');
        this.game.load.image('smoke', 'assets/smoke-puff.png');

        SM = new SoundsManager(game);
        function gameOver(state){
            SM.stop(SM.sounds.background);
            SM.play(SM.sounds.dies);
            this.game.state.start('gameOver', true, false, this);
            return;
        }
        this.game.gameOver = gameOver;
    },
    create: create,
    update: update,
    createEnemies: createEnemies,
    updateEnemies: updateEnemies,
    checkInputs: checkInputs,
    activeCheese: null
};

function createCheeses(){
    var game = this.game, newX = 0;
    cheese = cheeseGroup.create(0, -100, 'cheese');
    cheese.scale.set(.5,.5);

    rottenCheese = cheeseGroup.create(0, -100, 'rotten-cheese');
    rottenCheese.scale.set(.5,.5);
    newX = Math.floor( Math.random() * (this.game.width - cheese.width) );
    cheese.x = newX;
    rottenCheese.x = newX;
    game.physics.arcade.enable(cheese);
    game.physics.arcade.enable(rottenCheese);
    cheese.name = 'fuel-up';
    cheese.fuel = c.CHEESE_FUEL;
    cheese.body.velocity.y = 0;
    rottenCheese.body.velocity.y = 0;
    rottenCheese.name = 'fuel-down';
    rottenCheese.fuel = -1 * (c.CHEESE_FUEL/2);

    this.activeCheese = null;
}
function create() {
    var that = this, tileSize = 0, tilesCount = 0;

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
    var tile;
    for(var i = 0;i < tilesCount; i++){
        //                                      x                                   ,y         , width   , height  , sprite-name
        tile = this.game.add.tileSprite(0, i*this.game.height, this.game.width, this.game.height, 'clouds');
        tile._tileSpeed = 0.2;
        this._bg.push(tile);
    }
    tileSize = 320, tilesCount = parseInt(this.game.world.height/tileSize) + 1;
    for(var i = 0;i < tilesCount; i++){
        //                                      x                                   ,y         , width   , height  , sprite-name
        this._bg.push(this.game.add.tileSprite(this.game.world.centerX - tileSize/2 , i*tileSize, tileSize, tileSize, 'background'));
    }
    //Adding the creepers
    tileSize = 80, tilesCount = parseInt(this.game.world.height/tileSize) + 1;
    for(var i = 0;i < tilesCount; i++){
        this._bg.push(this.game.add.tileSprite(this.game.world.centerX - 320/2 - 2, i*tileSize, tileSize, tileSize, 'creeperL'));
    }
    for(var i = 0;i < tilesCount; i++){
        this._bg.push(this.game.add.tileSprite(this.game.world.centerX + 320/2 + 2 - tileSize, i*tileSize, tileSize, tileSize, 'creeperR'));
    }


    cheeseGroup = this.game.add.group();
    cheeseGroup.enableBody = true;
    createCheeses.call(this);

    enemyGroup = this.game.add.group();
    enemyGroup.enableBody = true;

    princess = new Princess(this.game, this.game.world.centerX, this.game.height - c.PRINCESS_HEIGHT, 0);
    princess.registerCollision(enemyGroup, function (that, enemy) {
        if(princess._canBeHurt){
            SM.play(SM.sounds.hit);
            enemy.kill();
            enemyGroup.remove(enemy);
            that._data.fuel += c.ENEMY_FUEL;
            princess._noChoqueMeChocaron();
        }
    });
    princess.registerCollision(cheeseGroup, function (that, cheese) {
        SM.play(cheese.fuel > 0 ? SM.sounds.cheese: SM.sounds.rotten_cheese);

        that.addFuel(cheese.fuel);
        that.score += Math.floor(cheese.fuel / 2);

        resetCheese.call(that, cheese);
    });

    fuelContainer = this.game.add.sprite(5 , 5,'fuel_container');
    //30, 5 is the diff for the container into the first px to render the bar.
    fuelBar = this.game.add.sprite(30 + 5, 5 + 5,'fuel');
    cropRect = new Phaser.Rectangle(0, 0, fuelBar.width, fuelBar.height);
    fuelMaxW = fuelBar.width;
    fuelBar.crop(cropRect);
    this.createEnemies();
    this.scoreText = this.game.add.bitmapText(this.game.width - 10, 10, 'scoreFont', this.game._my_world.score, 30);
    addScore.call(this, 0);
    if (this.game._debug) {
        this.game.stage.disableVisibilityChange = true;
        this.game.debug.start();
    }

    this.game.stage.backgroundColor = '#39c7fc';

    this.game.turbo = 2;

    cursors = this.game.input.keyboard.createCursorKeys();

    this.game.touchControl = this.game.plugins.add(Phaser.Plugin.TouchControl);
    this.game.touchControl.inputEnable();
    this.game.touchControl.settings.maxDistanceInPixels = 100;
    this.game.touchControl.settings.singleDirection = true;

    this.game.touchControl.imageGroup.forEach(function (e) {
        e.scale.setTo(0.75, 0.75);
    });

    SM.play(SM.sounds.start);
    SM.play(SM.sounds.background, true);
}

function updateScoreX(){
    //TODO: Refactor this to force right side align
    this.scoreText.x = this.game.width - 30 - this.scoreText.width;
}
function addScore(points){
    this.game._my_world.score += points;
    this.scoreText.text = this.game._my_world.score;
    updateScoreX.call(this);
}
function updateEnemies() {
    var game = this.game, enemies = enemyGroup.children;
    for (var i = 0; i < enemies.length; i++) {

        var velocity = this.game._my_world.velocity * this.game.turbo;
        enemies[i].body.velocity.y = velocity < c.MAX_VELOCITY ? velocity : c.MAX_VELOCITY;

        if (enemies[i].body.y > game.height) {
            addScore.call(this, 1);
            enemyGroup.remove(enemies[i], true, true);
        }
    }

    if(!enemyGroup.length) {
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

function resetCheese(currentCheese){
    currentCheese.y = -100 - 10 * Math.floor( Math.random() * 10 );
    currentCheese.x = Math.floor( Math.random() * this.game.width );
    currentCheese.body.velocity.y = 0;
    this.activeCheese = null;
}
function updateCheeses(){
    var currentCheese = this.activeCheese, game = this.game, nextCheese = 0, newX;

    if(currentCheese){
        if(currentCheese.body) {
            currentCheese.body.velocity.y = 100 * this.game.turbo;
        }else{
            //Somehow it is getting null bodies, maybe end of the game or after collide detection ):
            return;
        }
        if (currentCheese.body.y > this.game.height) {
            //Cheese lost.
            resetCheese.call(this, currentCheese);
        }
    }else{
        nextCheese = Math.floor( Math.random() * this.game._my_world.score );
        if(nextCheese < 10 || nextCheese < this.game._my_world.score*.30){
            this.activeCheese = cheese;
        }else{
            this.activeCheese = rottenCheese;
        }
        newX = Math.floor( Math.random() * this.game.width ) + 1;
        if(newX + this.activeCheese.width > this.game.width){
            newX = this.game.width - this.activeCheese.width;
        }
        this.activeCheese.body.x = newX;
        this.activeCheese.alive = true;
        this.activeCheese.visible = true;
    }
}
function updateEntities(){
    updateEnemies.call(this);
    updateScoreX.call(this);
    updateCheeses.call(this);
}

function update() {
    var velocity = parseInt(this.game._my_world.velocity / 50), tile;

    if(this.game.turbo == 4) {
        velocity += velocity;
    }
    for(var i = 0, len = this._bg.length; i< len; i++){
        //_tileSpeed
        tile = this._bg[i];
        if(tile._tileSpeed){
            tile.tilePosition.y += tile._tileSpeed
        }else{
            tile.tilePosition.y += velocity
        }
    }

    this.game._my_world.update();
    updateEntities.call(this);

    this.checkInputs();
    princess.update();
    cropRect.width =  (princess._data.fuel / c.MAX_FUEL) * fuelMaxW;
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
        enemy.scale.set(.7,.7);
        enemy.body.velocity.y = 100;
    }
}

function generateXForEnemy(index, game) {
    return index * (15 + game.width / enemiesPerLine);
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = play;
