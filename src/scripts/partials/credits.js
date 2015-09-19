/* globals require, Phaser, module */
var c = require('../constants'),
    //close,
    fairy, text,
    singleton = null,
    settingsWidth = 280, //TODO Move to constants
    settingsHeight = settingsWidth - 80;//TODO Move to constants
function PrincessCredits(game){
    if(singleton){
        return singleton;
    } else {
        singleton = this;
    }
    this.game = game;
    this._isVisible = false;
    this.setupFrames();
    //this.setupButtons();
    this.setupHada();
    game.input.onDown.add(this.clickEvent, this);
    this.hide();
}
PrincessCredits.prototype.isVisible = function(){
    return this._isVisible;
};

PrincessCredits.prototype.setupFrames = function(){
    var game = this.game,
        x2, y2;
    this.graphics = game.add.graphics(0, 0);
        var x = this.game.world.centerX - settingsWidth/2,
        y = this.game.world.centerY - settingsHeight/2 - 50;

    //Frame for bg
    settingsWidth = settingsWidth + 8;
    settingsHeight = settingsHeight + 8;
    //White Square
    x = x - 10;
    y = y - 10;
    settingsWidth = settingsWidth + 20;
    settingsHeight = settingsHeight + 40;
    this.subBg = new Phaser.Polygon();
    this.subBg.setTo([ new Phaser.Point(x, y), new Phaser.Point(x + settingsWidth, y), new Phaser.Point(x + settingsWidth, y + settingsHeight), new Phaser.Point(x, y + settingsHeight) ]);
    //Set edges for inner square
    this.x = x;
    this.y = y;
    this.width = settingsWidth;
    this.height = settingsHeight;

    //Black frame
    x = x - 2;
    y = y - 2;
    settingsWidth = settingsWidth + 4;
    settingsHeight = settingsHeight + 4;

    x2 = x + settingsWidth;
    y2 = y - 10;
    this.x2 = x2;
    this.y2 = y2;

    this.subBgBlack = new Phaser.Polygon();
    this.subBgBlack.setTo([ new Phaser.Point(x, y), new Phaser.Point(x + settingsWidth, y), new Phaser.Point(x + settingsWidth, y + settingsHeight), new Phaser.Point(x, y + settingsHeight) ]);
};

//PrincessCredits.prototype.setupButtons = function(){
//    var game = this.game;
//    close = game.add.sprite(0,0, c.SPRITES.CLOSE);
//    close.scale.set(0.5, 0.5);
//    game.physics.arcade.enable(close);
//    close.body.velocity.y = 0;
//    close.inputEnabled = true;
//    close.input.useHandCursor = true;
//    close.events.onInputDown.add(this.hide, this);
//    //Upper right corner
//    close.x = this.x2 - close.width/2 - 10;
//    close.y = this.y2 - close.height/2 + 10;
//};
PrincessCredits.prototype.hide = function(){
    this._isVisible = false;
    this.graphics.clear();
    //Maybe add to group?
    //close.visible = false;
    if(fairy){
        fairy.visible = false;
    }
    if(text){
        text.destroy();
    }
};
PrincessCredits.prototype.show = function(){
    this._isVisible = true;
    var graphics = this.graphics;
    //Drawing some frames
    //graphics.beginFill(0xC3C39F);
    //graphics.drawPolygon(this.bgFrame.points);
    //graphics.endFill();

    //graphics.beginFill(0xFFFFFF);
    //graphics.drawPolygon(this.bg.points);
    //graphics.endFill();

    graphics.beginFill(0xA1A188);
    graphics.drawPolygon(this.subBgBlack.points);
    graphics.endFill();

    graphics.beginFill(0xEFEFCE);
    graphics.drawPolygon(this.subBg.points);
    graphics.endFill();

    this.showText();
    //close.visible = true;
    fairy.visible = true;
};

PrincessCredits.prototype.setupHada = function(){
    var game = this.game, x, y;
    fairy = this.game.add.sprite(0, 0, c.SPRITES.HADA);
    x = this.game.world.centerX + settingsWidth/2 + 50;
    y = this.game.world.centerY - settingsHeight/2 ;
    fairy.x = x;
    fairy.y = y;
    fairy.scale.set(-1, 1);
    fairy.animations.add('animate');
    fairy.animations.play('animate', 2, true, false);
};
//this, 'bg-woods', 16.5, this.game.world.centerX - 150, this.game.world.centerY/2 + 35, c.SPRITES.HADA, 2, true
//function addFrame (that, bgimage, timeOnStage, spriteX, spriteY, sprites, framerate, loop) {
//    background = that.game.add.sprite(that.game.world.centerX - 200, that.game.world.centerY/2, bgimage);
//    characters = that.game.add.sprite(spriteX, spriteY, sprites);
//    characters.animations.add('animate');
//    characters.animations.play('animate', framerate, loop, false);
//}
var txtCredits = {
    text: c.TEXT.CREDITS, // TODO: Move to constants
    obj: { font: "17px Arial", fill: "#080808", align: "left" }
};
PrincessCredits.prototype.showText = function(){
    var x = this.game.world.centerX - settingsWidth/2 + 20,
        y = this.game.world.centerY - settingsHeight/2 - 20;
    text = this.game.add.text(x, y, txtCredits.text, txtCredits.obj);
    //text.anchor.setTo(0.5, 0.5);
};
PrincessCredits.prototype.clickEvent = function(event){
    //if(localCollides(event, close)){
        this.hide();
    //}
};
//TODO: make this funct shared
function localCollides(event, sprite){
    var x = event.x,
        y = event.y;
    return x >= sprite.x && x <= (sprite.x + sprite.width) && y >= sprite.y && y <= sprite.y + sprite.height;
}
module.exports = PrincessCredits;

