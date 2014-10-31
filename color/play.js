Game.Play = function (game) { };

Game.Play.prototype = {
    create: function () {
        // Calculate Sizes
        this.squareSize = h / 2; // 960 (50% of height) Size of  1 square
        this.squareSpacing = h * 0.51; // 980 (51% of height) 
        
        this.xSpacing = (w / 2) - (this.squareSize / 2); // 60 (5.55% of width, 50% of width - 50% of square size)
        this.ySpacing = h * 0.21875; // 420 (21.875% of height) Space between square and top
        
        this.titleTop = h * 0.04; // 75 (4% of height)
        this.uiTop = h * 0.13; // 250 (13% of height)
        
        this.titleFontSize = h * 0.0416; // 80 (4.16% of height)
        this.scoreFontSize = h * 0.026; // 50 (2.6% of height)
        
        this.pieRadius = h * 0.013; // 25 (1.3% of height)
        this.pieRight = (this.squareSpacing + this.xSpacing) - this.pieRadius * 2; // edge of single square - diameter
        
        // Initialize Keys
        this.cursor = game.input.keyboard.createCursorKeys();
        // Initialize Graphics Renderer
        this.graphics = game.add.graphics(0, 0);
        
        // Title label
        var titleStyle = {
            font: this.titleFontSize.toString() + 'px "Varela Round"',
            fill: '#000'
        };
        this.titleLabel = game.add.text(Math.floor(w / 2), this.titleTop, 'q u i c k  f l i p', titleStyle);
        this.titleLabel.anchor.setTo(0.5, 0);
        
        // Score Label
        var scoreStyle = {
            font: this.scoreFontSize.toString() + 'px "Varela Round"',
            fill: '#000'
        };
        this.labelScore = game.add.text(Math.floor(w / 2), this.uiTop, '0', scoreStyle);
        this.labelScore.anchor.setTo(0.5, 0);
        
        // Start Label
	    this.labelKeys = game.add.text(Math.floor(w / 2) + 1, h - 50, 'tap to begin', { font: '20px Arial', fill: '#000' });
	    this.labelKeys.anchor.setTo(0.5, 1);
        
        // Next-level piece
        this.answerRect = null;
        
        // Current Level
        level = 0;
        
        // Start Flag
        this.firstKey = false;
        
        // Last grid color
        this.baseColor = "";
        
        // Pie timer
        this.pie = new PieProgress(game, this.pieRight, this.uiTop + this.pieRadius / 2, this.pieRadius, '#000');
        game.add.existing(this.pie);
        
        // Start timer
        this.pieTween = game.add.tween(this.pie).from({progress: 0}, 10000, 
        Phaser.Easing.Linear.InOut, false, 0, 0, false);
    },
    
    // Time ran out
    timeOut: function () {
        game.state.start('Over');   
    },
    
    // Generate next level
    nextLevel: function() {
        level++;
        
        var width = level + 1;
        var height = level + 1;
        
        if (level >= 6)
            width = 6;
        if (level >= 9)
            height = 9;
        
        this.labelScore.text = (level - 1) * 10;
        this.drawGrid(width, height, this.squareSpacing / width);
    },
    
    // Draw squares in level
    drawGrid: function(width, height, spacing) {
        // Clear screen
        this.graphics.clear();
        
        // Generate level color
        this.baseColor = this.randHex();
        
        // Update timer color
        this.pie.color = this.baseColor;
        
        // Lighten color for answer piece
        var color = this.colorLuminance(this.baseColor, (20 - level * 1.15) / 100);
        
        // Generate random answer piece
        var answerX = rand(width);
        var answerY = rand(height);
        var answerXPos = (answerX * spacing) + this.xSpacing;
        var answerYPos = (answerY * spacing) + this.ySpacing;
        
        // Calculate size
        var sSize = this.squareSize / width;
        
        // Add piece to grid
        this.answerRect = new Phaser.Rectangle(answerXPos, answerYPos, sSize, sSize);
        
        // Draw grid
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                if (x == answerX && y == answerY)
                    this.graphics.beginFill("0x" + color.substr(1));
                else
                    this.graphics.beginFill("0x" + this.baseColor.substr(1), 1);
                
                // Calculate position
                var xPos = (x * spacing) + this.xSpacing;
                var yPos = (y * spacing) + this.ySpacing;
                
                this.graphics.drawRect(xPos, yPos, sSize, sSize);
            }
        }
    },
    
    update: function () {
        // Start game?
        if (game.input.activePointer.isDown && !this.firstKey) {
            this.firstKey = true;
            this.game.add.tween(this.labelKeys).to( { alpha: 0 }, 800, Phaser.Easing.Linear.None).start();
            
            this.pieTween.onComplete.add(this.timeOut);
            this.pieTween.start();
            
            this.nextLevel();
        }

        // Stop if game isn't started
        if (!this.firstKey)
            return;
        
        // Check if clicked answer piece
        if (game.input.activePointer.isDown) {
            var touchX = game.input.activePointer.x;
            var touchY = game.input.activePointer.y;
            
            if (this.answerRect.contains(touchX, touchY))
                this.nextLevel();
        }
    },
    
    // Generate Random Hex Color
    // http://www.paulirish.com/2009/random-hex-color-code-snippets/
    randHex: function () {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);   
    },
    
    // Manipulate color
    // http://www.sitepoint.com/javascript-generate-lighter-darker-color/
    colorLuminance: function(hex, lum) {
        // Validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        
        if (hex.length < 6)
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        
        lum = lum || 0;
        
        // Convert to decimal and change luminosity
        var rgb = "#", c, i;
        
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }
        
        return rgb;
    },
};

// Pie Timer
PieProgress = function(game, x, y, radius, color, angle) {
    this._radius = radius;
    this._progress = 1;
    this.bmp = game.add.bitmapData(radius * 2, radius * 2);
    Phaser.Sprite.call(this, game, x, y, this.bmp);
   
    this.anchor.setTo(0.5);
    this.angle = angle || -90;
    this.color = color || "#000";
    
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