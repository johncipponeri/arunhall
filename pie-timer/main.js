// Phaser current version test environment
// Configurable 'pie' progress indicator

var game = new Phaser.Game(600, 400, Phaser.AUTO, 'game_div');

var BasicGame = function(game) {};

BasicGame.Boot = function (game) {};

var pie;

BasicGame.Boot.prototype = 
{
    preload: function() {
        game.time.advancedTiming = true;
        game.stage.backgroundColor = '#000';
    },
	create: function() 
	{
        pie = new PieProgress(game, game.world.centerX, game.world.centerY, 32);
        game.world.add(pie);
        
        game.add.tween(pie).to({progress: 0}, 2000, Phaser.Easing.Quadratic.InOut, true, 0, Infinity, true);
        
        game.add.tween(pie).to({radius: 64}, 1000, Phaser.Easing.Back.InOut, true, 1000, Infinity, true);
        
        game.time.events.loop(500, function() {
            pie.color = game.rnd.pick(["#f00", "#0f0", "#00f", "#ff0", "#0ff", "#f0f", "#fff"]);
        }, this);
    },
    update: function() {
        
    },
    render: function()
    {
        game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
    }
};

var PieProgress = function(game, x, y, radius, color, angle) {
    this._radius = radius;
    this._progress = 1;
    this.bmp = game.add.bitmapData(radius * 2, radius * 2);
    Phaser.Sprite.call(this, game, x, y, this.bmp);
    
    this.anchor.setTo(0.5);
    this.angle = angle || -90;
    this.color = color || "#fff";
    this.updateProgress();
}

PieProgress.prototype = Object.create(Phaser.Sprite.prototype);
PieProgress.prototype.constructor = PieProgress;

PieProgress.prototype.updateProgress = function() {
    var progress = this._progress;
    progress = Phaser.Math.clamp(progress, 0.00001, 0.99999);
    
    this.bmp.clear();
    this.bmp.context.fillStyle = this.color;
    this.bmp.context.beginPath();
    this.bmp.context.arc(this._radius, this._radius, this._radius, 0, (Math.PI * 2) * progress, true);
    this.bmp.context.lineTo(this._radius, this._radius);
    this.bmp.context.closePath();
    this.bmp.context.fill();
    this.bmp.dirty = true; 
}

Object.defineProperty(PieProgress.prototype, 'radius', {
    get: function() {
        return this._radius;   
    },
    set: function(val) {
        this._radius = (val > 0 ? val : 0);
        this.bmp.resize(this._radius * 2, this._radius * 2);
        this.updateProgress();
    }
});

Object.defineProperty(PieProgress.prototype, 'progress', {
    get: function() {
        return this._progress;   
    },
    set: function(val) {
        this._progress = Phaser.Math.clamp(val, 0, 1);
        this.updateProgress();
    }
});



game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');