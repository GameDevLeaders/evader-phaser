var step = 6;
var Princess = function(game) {
    var princess = {
            fuel: 100,
            create: create,
            setPosition: setPosition,
//            update: update,
            render: render,
//            checkCollisions: checkCollisions,
            moveLeft: moveLeft,
            moveRight: moveRight,
            playerGroup: null,
            getBody: getBody,
            game: game,
        };
        princess.create();
        return princess;
};

function setPosition(x, y){
    this.playerGroup.forEachAlive(setGroupPosition, this, x, y);
}
function setGroupPosition(member, x, y){
    member.x = x;
    member.y = y;
}
function create(){
    var playerGroup = this.game.add.group();
    playerGroup.enableBody = true;
    var playerHBox = playerGroup.create(0, 0, 'princess'),
        playerVBox = playerGroup.create(0, 0);
    playerHBox.body.setSize(28,80,8,5);
    playerVBox.body.setSize(25,40,30,10);
    playerHBox.name = 'princess';
    playerVBox.name = 'mouse';
    playerHBox.body.velocity.y = 0;
    playerVBox.body.velocity.y = 0;

    this.playerGroup = playerGroup;
}
module.exports = Princess;



function moveLeft(){
    moveGroupLeft.call(this);
    //this.playerGroup.forEachAlive(moveGroupLeft, this);
}
function moveGroupLeft(member){
    var parts = this.playerGroup.children, newX = 0,
        leftestBodyPart = parts[0], diff = step*this.game.turbo,
        leftestX = leftestBodyPart.body.x; //princess body
    newX = leftestX - diff;

    if(newX < 0){
        //If moving out of the screen, stay at 0.
        diff = leftestX;
    }
    //Move every part to the left.
    for (var i = 0; i < parts.length; i++) {
        newX = parts[i].body.x - diff;
        parts[i].body.x = newX;
    }
}
function moveRight(){
    moveGroupRight.call(this);
//    this.playerGroup.forEachAlive(moveGroupRight, this);
}
function moveGroupRight(){
    var parts = this.playerGroup.children, newX = 0,
    mousePart = parts[1], diff = step*this.game.turbo,
    mouseRightX = mousePart.body.x + mousePart.body.width; //mouse right x
    newX = mouseRightX + diff;

    if(mouseRightX + diff >= this.game.width){
        //If moving out of the screen, stay at max width.
        diff = this.game.width - mouseRightX;
        return;
    }
    for (var i = 0; i < parts.length; i++) {
        newX = parts[i].body.x + diff;
        parts[i].body.x = newX;
        newX = parts[i].body.x + step*this.game.turbo;
    }
}
function getBody(){
    return this.playerGroup;
}
function render(){
    this.playerGroup.forEachAlive(renderGroup, this);
}
function renderGroup(member) {
    this.game.debug.body(member);
}
