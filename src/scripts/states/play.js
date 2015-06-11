var Princess = require('../entities/princess');
var World = require('../entities/world');
var c = require('../constants');

var cursors,
    cheeseGroup,
    enemyGroup,
    princess,
    fuelContainer,
    fuelBar,
    cheese,
    rottenCheese,
    sounds;

var play = function(game) {};

play.prototype = {
    preload: function () {
        var game = this.game;
        //sounds
        this.game.load.audio('explosion', 'assets/audio/dies.wav');
        //sprites
        this.game.load.spritesheet('princess', 'assets/sprites/princess.png', 100, 140, 3);
        this.game.load.spritesheet('lumberjack', 'assets/sprites/lumberjack-s.png', 168, 124, 2);
        this.game.load.image('princess_center', 'assets/sprites/princess-back.png');
        this.game.load.image('princess_left', 'assets/sprites/princess-side.png');
        this.game.load.image('fuel_container', 'assets/sprites/fuelbar.png');
        this.game.load.image('fuel', 'assets/sprites/fuelbar-fill.png');
        this.game.load.image('cheese', 'assets/sprites/cheese.png');
        this.game.load.image('rotten-cheese', 'assets/sprites/rottencheese.png');
//        this.game.load.image('lumberjack', 'assets/sprites/lumberjack.png');
        this.game.load.image('wolf', 'assets/sprites/wolf.png');
        this.game.load.image("background", "assets/sprites/castle-texture.png");

        sounds = {
                dies: game.add.audio('explosion')
        };
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
    cheese.fuel = 15;
    cheese.body.velocity.y = 0;
    rottenCheese.body.velocity.y = 0;
    rottenCheese.name = 'fuel-down';
    rottenCheese.fuel = -7;

    this.activeCheese = null;
}
function create() {
    var that = this;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game._debug = false;
    this.game._my_world = new World();

    console.log(this.game.world.width);
    this.bg1 = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.cache.getImage('background').height, 'background');
    this.bg2 = this.game.add.tileSprite(0, this.game.cache.getImage('background').height, this.game.world.width, this.game.cache.getImage('background').height, 'background');

    cheeseGroup = this.game.add.group();
    cheeseGroup.enableBody = true;
    createCheeses.call(this);

    enemyGroup = this.game.add.group();
    enemyGroup.enableBody = true;

    cursors = this.game.input.keyboard.createCursorKeys();

    princess = new Princess(this.game, 160, 400, 0);
    princess.registerCollision(enemyGroup, function (that, enemy) {
        enemy.kill();
        enemyGroup.remove(enemy);
        that._data.fuel += -15;
    });
    princess.registerCollision(cheeseGroup, function (that, cheese) {
        that.addFuel(cheese.fuel);
        that.score += Math.floor(cheese.fuel / 2);

        resetCheese.call(that, cheese);
    });

    fuelContainer = this.game.add.sprite(0,0,'fuel_container');
    fuelBar = this.game.add.sprite(0,0,'fuel');
    fuelBar.cropEnabled = true;

    this.createEnemies();

    this.scoreText = this.game.add.text(10, 10, 'Score: ' + this.game._my_world.score, { font: '16px Arial', fill: '#fff' });
    if (this.game._debug) {
        this.game.stage.disableVisibilityChange = true;
        this.game.debug.start();
    }
}

function updateEnemies() {
    var game = this.game, enemies = enemyGroup.children;
    for (var i = 0; i < enemies.length; i++) {

        var velocity = this.game._my_world.velocity * this.game.turbo;
        enemies[i].body.velocity.y = velocity < c.MAX_VELOCITY ? velocity : c.MAX_VELOCITY;

        if (enemies[i].body.y > game.height) {
            this.game._my_world.score++;
            enemyGroup.remove(enemies[i], true, true);
        }
    }

    if(!enemyGroup.length) {
        this.createEnemies();
    }
    else {
        var lastEnemy = enemyGroup.children[enemyGroup.children.length - 1];
        if (lastEnemy.body.y > lastEnemy.body.height * 2.5) {
            this.createEnemies();
        }
    }
}

function checkInputs(){
    // TODO - Refactor this
    this.game.turbo = 1;
    if (cursors.up.isDown) {
        this.game.turbo = 4;
    }
    if (cursors.left.isDown) {
        princess.move(c.LEFT);
    } else if (cursors.right.isDown) {
        princess.move(c.RIGHT);
    }
}
function gameOver(){
    console.log(sounds.dies);
    //sounds.dies.play(); // PLEASE !!
    this.game.state.start('gameOver', true, false, this);
    return;
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
    this.updateEnemies();
    updateCheeses.call(this);
}
function update() {
    var velocity = parseInt(this.game._my_world.velocity / 50);
    if(this.game.turbo == 4) {
        velocity += velocity;
    }

    this.bg1.tilePosition.y += velocity;
    this.bg2.tilePosition.y += velocity;

    this.game._my_world.update();
    updateEntities.call(this);

    this.checkInputs();

    princess.update();

    // TODO - tony - fix this
    fuelBar.width = (princess._data.fuel / c.MAX_FUEL) * fuelContainer.width;
    //window.aa = fuelBar;

    if (this.game._debug) {
        enemyGroup.forEachAlive(function (member) {
            this.game.debug.body(member);
        }, this);
    }
}

function createEnemies() {
    var game = this.game, 
        line = this.game._my_world.getLine(),
        isWolf = getRandom(0, 3) === 0,
        enemySpriteName = isWolf ? 'wolf' : 'lumberjack',
        x, //generated X
        enemy; //the enemy (Sprite) to be added.

    for (var i = 0; i < line.length; i++) {
        if (line[i] === 0) {
            continue;
        }

        x = generateXForEnemy(i, game);
        if(isWolf){
            enemy = enemyGroup.create(x, -100, enemySpriteName);
        } else {
            console.log(enemy);
            enemy = game.add.sprite(x, -100, enemySpriteName);
            //enemyGroup.create(x, -100, enemySpriteName);
            enemy.animations.add('idle');
            enemy.animations.play('idle', 30, true);
            enemyGroup.add(enemy);
        }
        enemy.scale.set(.7,.7);
        enemy.body.velocity.y = 100;
    }
}

function generateXForEnemy(index, game) {
    if (index === 0) {
        return 10;
    } else if (index === 1) {
        return game.width / 2 - 49;
    } else {
        return game.width - 100;
    }
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = play;
