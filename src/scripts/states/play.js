var play = function(game) {};
var Princess = require('../entities/princess');
var map = [
    [0,0,1],
    [0,1,0],
    [0,1,1],
    [1,0,0],
    [1,0,1],
    [1,1,0]
];

var cursors,
    enemyGroup,
    enemy,
    princess;

play.prototype = {
    preload: function () {
        this.game.load.image('enemy', 'assets/enemy.png');
        this.game.load.image('princess', 'assets/princess.png');
        this.game.load.image('heart', 'assets/heart.png');
    },
    create: create,
    update: update,
    render: render,
    //princess : null,
    createPlayer: createPlayer,
    createEnemies: createEnemies,
    checkCollisions: checkCollisions,
    updateEnemies: updateEnemies,
    checkInputs: checkInputs,
    score: 0,
};
function setScoreText(){
    this.scoreText.text = 'Score: ' + this.score;
}
function create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.lives = 3;

    enemyGroup = this.game.add.group();
    enemyGroup.enableBody = true;
    cursors = this.game.input.keyboard.createCursorKeys();
    this.createPlayer();
    this.createEnemies();

    this.hearts = this.game.add.group();
    this.scoreText = this.game.add.text(10, 10, 'Score: ' + this.score, { font: '16px Arial', fill: '#fff' });
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
function updateEnemies(){
    var game = this.game, enemies = enemyGroup.children;
    for (var i = 0; i < enemies.length; i++) {
      enemies[i].body.velocity.y = 100 * this.game.turbo;
      if (enemies[i].body.y > game.height) {
          this.score++;
          setScoreText.call(this);
          enemyGroup.remove(enemies[i], true, true);
      }
    }
    var lastEnemy = enemyGroup.children[enemyGroup.children.length-1];
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
function checkCollisions(){
    var currentState = this, game = this.game;
    game.physics.arcade.overlap(princess.getBody(), enemyGroup, function (player, enemy, c) {
        console.log('COLLIDES with ' + player.name);
        enemy.kill();
        currentState.lives--;
        if(currentState.lives == 0) {
            game.state.start('gameOver');
        }

        var heart = currentState.hearts.getFirstAlive();
        if (heart)
        {
            heart.kill();
        }
    });
}
function update() {
    this.updateEnemies();
    this.checkCollisions.call(this, this.game);
    this.checkInputs();
}

function render(){
    enemyGroup.forEachAlive(renderGroup, this);
    princess.render();
}
function renderGroup(member) {
    this.game.debug.body(member);
}
function createEnemies() {
    var game = this.game, line = map[getRandom(0, map.length-1)];
    for (var i = 0; i < line.length; i++) {
        if (line[i] === 0) {
            continue;
        }

        var x = generateXForEnemy(i, game);
        var enemy = enemyGroup.create(x, -100, 'enemy');
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
