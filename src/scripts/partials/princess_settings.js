/* globals require, Phaser, module */
;(function(Phaser, module){
    'use strict';
    var c = require('../constants');
    var SoundsManager = require('../sounds.js');
    var SM,
        close,
        restart,
        speaker;
    function PrincessSettings(game){
        this.game = game;
        this.setupFrames();
        this.setupButtons();
        SM = new SoundsManager(game);

        game.input.onDown.add(this.clickEvent, this);
    }
    PrincessSettings.prototype.setupFrames = function(){
        var game = this.game;
        this.graphics = game.add.graphics(0, 0);
        var settingsWidth = 280,
            settingsHeight = settingsWidth - 80,
            x = this.game.world.centerX - settingsWidth/2,
            y = this.game.world.centerY - settingsHeight/2 - 50;

        //Sandy polygon
        this.bg = new Phaser.Polygon();
        this.bg.setTo([ new Phaser.Point(x, y + 10), new Phaser.Point(x + settingsWidth, y - 10), new Phaser.Point(x + settingsWidth - 10, y + settingsHeight), new Phaser.Point(x + 10, y + settingsHeight) ]);

        //Frame for bg
        x = x - 4;
        y = y - 4;
        settingsWidth = settingsWidth + 8;
        settingsHeight = settingsHeight + 8;

        var x2 = x + settingsWidth,
            y2 = y - 10;
        this.x2 = x2;
        this.y2 = y2;
        this.bgFrame = new Phaser.Polygon();
        this.bgFrame.setTo([ new Phaser.Point(x, y + 10), new Phaser.Point(x2, y2), new Phaser.Point(x + settingsWidth - 10, y + settingsHeight), new Phaser.Point(x + 10, y + settingsHeight) ]);

        //White Square
        x = x - 5;
        y = y + 20;
        settingsWidth = settingsWidth + 10;
        settingsHeight = settingsHeight - 40;
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
        this.subBgBlack = new Phaser.Polygon();
        this.subBgBlack.setTo([ new Phaser.Point(x, y), new Phaser.Point(x + settingsWidth, y), new Phaser.Point(x + settingsWidth, y + settingsHeight), new Phaser.Point(x, y + settingsHeight) ]);
    };
    PrincessSettings.prototype.hide = function(){
        this.graphics.clear();
        //Maybe add to group?
        close.visible = false;
        restart.visible = false;
        speaker.visible = false;
    };
    PrincessSettings.prototype.show = function(){
        var graphics = this.graphics;
        //Drawing some frames
        graphics.beginFill(0xC3C39F);
        graphics.drawPolygon(this.bgFrame.points);
        graphics.endFill();

        graphics.beginFill(0xFFFFFF);
        graphics.drawPolygon(this.bg.points);
        graphics.endFill();

        graphics.beginFill(0xA1A188);
        graphics.drawPolygon(this.subBgBlack.points);
        graphics.endFill();

        graphics.beginFill(0xEFEFCE);
        graphics.drawPolygon(this.subBg.points);
        graphics.endFill();


        close.visible = true;
        restart.visible = true;
        speaker.visible = true;
    };
    PrincessSettings.prototype.setupButtons = function(){
        var game = this.game;
        close = game.add.sprite(0,0, c.SPRITES.CLOSE);
        close.scale.set(0.4, 0.4);
        restart = game.add.sprite(0,0, c.SPRITES.RESTART);
        speaker = game.add.sprite(0,0, c.SPRITES.SPEAKER_ON);

        game.physics.arcade.enable(close);
        game.physics.arcade.enable(restart);
        game.physics.arcade.enable(speaker);

        close.body.velocity.y = 0;
        restart.body.velocity.y = 0;
        speaker.body.velocity.y = 0;

        close.inputEnabled = true;
        restart.inputEnabled = true;
        speaker.inputEnabled = true;

        close.input.useHandCursor = true;
        restart.input.useHandCursor = true;
        speaker.input.useHandCursor = true;

        close.events.onInputDown.add(this.hide, this);
        restart.events.onInputDown.add(this.restart, this);
        speaker.events.onInputDown.add(this.toggleSound, this);


        //Upper right corner
        close.x = this.x2 - close.width/2 - 10;
        close.y = this.y2 - close.height/2 + 10;

        //Left aligned around middle
        //restart.x = this.x + 20;
        //restart.y = this.y + this.height/2 - restart/2;

        restart.x = this.x + 30;
        restart.y = this.y + this.height/2 - restart.width/2;

        speaker.x = this.x + this.width - 30 - speaker.width;
        speaker.y = this.y + this.height/2 - speaker.height/2;
    };

    PrincessSettings.prototype.restart = function(){
        //For some reason this is breaking the settings, requires a nullify.
        this.game.paused = false;
        SM.stop(c.SOUNDS.START);
        SM.stop(c.SOUNDS.BACKGROUND);
        this.game.state.start(c.STATES.play,true,false);
    };

    PrincessSettings.prototype.toggleSound = function(){
        SM.toggle();
        if(SM.isActive()){
            speaker.loadTexture(c.SPRITES.SPEAKER_ON);
        } else {
            speaker.loadTexture(c.SPRITES.SPEAKER_OFF);
        }
    };
    PrincessSettings.prototype.clickEvent = function(evt){
        if(localCollides(event, close)){
            this.hide();
        } else if(localCollides(event, speaker)){
            this.toggleSound();
        } else if(localCollides(event, restart)){
            this.restart();
        }
    };

    function localCollides(event, sprite){
        var x = event.x,
            y = event.y;
        return x >= sprite.x && x <= (sprite.x + sprite.width) && y >= sprite.y && y <= sprite.y + sprite.height;
    }
    module.exports = PrincessSettings;
})(Phaser, module);

