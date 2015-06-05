var play = function(game) {};
var Princess = require('../entities/princess');
var World = require('../entities/world');

var MAX_VELOCITY = 800;

var cursors,
    enemyGroup,
    enemy,
    princess,
    cheese,
    rottenCheese, 
    sounds;

play.prototype = {
    preload: function () {
        var game = this.game;
        //sounds
        this.game.load.audio('explosion', 'assets/audio/dies.wav');
        //sprites
        this.game.load.image('lumberjack', 'assets/enemy-1.png');
        this.game.load.image('wolf', 'assets/enemy-2.png');
        this.game.load.image('princess', 'assets/princess.png');
        this.game.load.image('heart', 'assets/heart.png');
        this.game.load.image('cheese', 'assets/cheese.png');
        this.game.load.image('rotten-cheese', 'assets/rotten-cheese.png');
        sounds = {
                dies: game.add.audio('explosion'),
        };
    },
    create: create,
    update: update,
    render: render,
    //princess : null,
    createPlayer: createPlayer,
    createEnemies: createEnemies,
    checkCollisions: checkCollisions,
    updateEnemies: updateEnemies,
    updatePlayer: updatePlayer,
    checkInputs: checkInputs,
    score: 0,
    activeCheese: null,
};
function setScoreText(){
    this.scoreText.text = 'Score: ' + this.score;
}
function setFuelText(){
    if(princess.fuel<=0){
        princess.fuel = 0;
    }
    this.fuelText.text = 'Fuel: ' + princess.fuel;
}
function createCheeses(){
    var game = this.game, newX = 0;
    cheese = this.game.add.sprite(0, -100, 'cheese');
    rottenCheese = this.game.add.sprite(0, -100, 'rotten-cheese');
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
    this.game._my_world = new World();
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.lives = 3;
    createCheeses.call(this);
    enemyGroup = this.game.add.group();
    enemyGroup.enableBody = true;
    cursors = this.game.input.keyboard.createCursorKeys();
    this.createPlayer();
    this.createEnemies();

    this.hearts = this.game.add.group();
    this.scoreText = this.game.add.text(10, 10, 'Score: ' + this.score, { font: '16px Arial', fill: '#fff' });
    this.fuelText =  this.game.add.text(10, 30, 'Fuel: ' + princess.fuel, { font: '16px Arial', fill: '#fff' });
    this.game.add.text(this.game.world.width - 110, 10, 'Lives : ', { font: '16px Arial', fill: '#fff' });
    for (var i = 0; i < 3; i++)
    {
        var heart = this.hearts.create(this.game.world.width - 100 + (30 * i), 45, 'heart');
        heart.anchor.setTo(0.5, 0.5);
        heart.alpha = 0.6;
    }
}

function createPlayer(){
    var game = this.game,
        x = 50, 
        y = game.height - 100;
    princess = new Princess(game);
    princess.setPosition(x, y);
    this.score = 0;
}

function updateEnemies() {
    var game = this.game, enemies = enemyGroup.children;
    for (var i = 0; i < enemies.length; i++) {

        var velocity = this.game._my_world.velocity * this.game.turbo;
        enemies[i].body.velocity.y = velocity < MAX_VELOCITY ? velocity : MAX_VELOCITY;

        if (enemies[i].body.y > game.height) {
            this.score++;
            setScoreText.call(this);
            enemyGroup.remove(enemies[i], true, true);
        }
    }
    var lastEnemy = enemyGroup.children[enemyGroup.children.length - 1];
    if (lastEnemy.body.y > lastEnemy.body.height * 2.5) {
        this.createEnemies();
    }
}

function checkInputs(){
    var game = this.game;
    this.game.turbo = 1;
    if (cursors.up.isDown) {
        this.game.turbo = 4;
    }
    if (cursors.left.isDown) {
        princess.moveLeft(game);
    } else if (cursors.right.isDown) {
        princess.moveRight(game);
    }
}
function gameOver(){
    console.log(sounds.dies);
    //sounds.dies.play(); // PLEASE !!
    this.game.state.start('gameOver', true, false, this);
    return;
}
function checkCollisions(){
    var currentState = this, game = this.game;
    game.physics.arcade.overlap(princess.getBody(), enemyGroup, function (player, enemy, c) {
        enemy.kill();
        currentState.lives--;
        if(currentState.lives == 0) {
            gameOver.call(currentState);
            return;
        }
        var heart = currentState.hearts.getFirstAlive();
        if (heart)
        {
            heart.kill();
        }
    });

    game.physics.arcade.overlap(princess.getBody(), this.activeCheese, function (cheese, part, c) {
        princess.fuel += cheese.fuel;
        resetCheese.call(currentState, cheese);
        setFuelText.call(currentState);
        if(princess.fuel > 0) {
            this.score += (cheese.fuel / 2);
            if(princess.fuel > 100) {
                princess.fuel = 100;
            }
        }
    });
}
var skip = 30;
function updatePlayer(){
    var currentState = this, game = this.game;
    if(skip > 0){
        skip -= 2;
        return;
    }
    skip = 60;
    princess.fuel-=2;
    setFuelText.call(this);
}
function resetCheese(currentCheese){
    currentCheese.y = -100 - 10 * Math.floor( Math.random() * 10 );
    currentCheese.x = Math.floor( Math.random() * this.game.width );
    currentCheese.body.velocity.y = 0;
    this.activeCheese = null;
}
function updateCheeses(){
    var currentCheese = this.activeCheese, game = this.game, nextCheese = 0, newX;
    if(princess.fuel <= 0) {
        gameOver.call(this);
        return;
    }
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
        nextCheese = Math.floor( Math.random() * this.score );
        if(nextCheese < 10 || nextCheese < this.score*.30){
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
    this.updatePlayer();
    this.updateEnemies();
    updateCheeses.call(this);
}
function update() {
    this.game._my_world.update(this.score);
    updateEntities.call(this);
    this.checkCollisions.call(this, this.game);
    this.checkInputs();
}

/*
 * Calls the render for each entity, just user for debugging purposes for now.
 */
function render(){
    //enemyGroup.forEachAlive(renderGroup, this);
    //princess.render();
}
function renderGroup(member) {
    this.game.debug.body(member);
}

function createEnemies() {
    var game = this.game;
    var line = this.game._my_world.getLine();
    var isWolf = getRandom(0, 3) === 0;
    var enemySpriteName = isWolf ? 'wolf' : 'lumberjack';

    for (var i = 0; i < line.length; i++) {
        if (line[i] === 0) {
            continue;
        }

        var x = generateXForEnemy(i, game);
        var enemy = enemyGroup.create(x, -100, enemySpriteName);
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
