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
            fill: '#424143'
        };
        this.titleLabel = game.add.text(Math.floor(w / 2), this.titleTop, 'q u i c k  f l i p', titleStyle);
        this.titleLabel.anchor.setTo(0.5, 0);
        
        // Score Label
        var scoreStyle = {
            font: this.scoreFontSize.toString() + 'px "Varela Round"',
            fill: '#424143'
        };
        this.labelScore = game.add.text(Math.floor(w / 2), this.uiTop, '0', scoreStyle);
        this.labelScore.anchor.setTo(0.5, 0);
        
        // Back arrow hitbox
        this.backRect = new Phaser.Rectangle(this.xSpacing, this.uiTop, this.pieRadius * 2, this.pieRadius * 2);
        // Add Back arrow to screen
        this.backP1 = new Phaser.Point(this.backRect.x, this.backRect.y + this.backRect.height / 2);
        this.backP2 = new Phaser.Point(this.backRect.x + this.backRect.width, this.backRect.y);
        this.backP3 = new Phaser.Point(this.backRect.x + this.backRect.width, this.backRect.y + this.backRect.height);
        this.drawBack("0x424143");
        
        // Start Label
	    this.labelKeys = game.add.text(Math.floor(w / 2) + 1, Math.floor(h / 2), 'tap to begin', { font: '40px Arial', fill: '#424143' });
	    this.labelKeys.anchor.setTo(0.5, 0.5);
        
        // Next-level piece
        this.answerRect = null;
        
        // Current Level
        level = 0;
        
        // Start Flag
        this.firstKey = false;
        
        // Last grid color
        this.baseColor = "";
        
        // Pie timer
        this.pie = new PieProgress(game, this.pieRight, this.uiTop + this.pieRadius, this.pieRadius, '#000');
        game.add.existing(this.pie);
        
        // Start timer
        this.pieTween = game.add.tween(this.pie).from({progress: 0}, 30000, 
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
    
    // Draws back arrow
    drawBack: function(color) {
        this.graphics.beginFill(color);
        this.graphics.moveTo(this.backP1.x, this.backP1.y);
        this.graphics.lineTo(this.backP2.x, this.backP2.y);
        this.graphics.lineTo(this.backP3.x, this.backP3.y);
        this.graphics.lineTo(this.backP1.x, this.backP1.y);
    },
    
    // Draw squares in level
    drawGrid: function(width, height, spacing) {
        // Clear screen
        this.graphics.clear();
        
        // Generate level color
        this.baseColor = this.randHex();
        
        // Update timer color
        this.pie.color = this.baseColor;
        
        // Update back color
        this.drawBack("0x" + this.baseColor.substr(1), 1);
        
        // Lighten color for answer piece
        var lum = (level % 2) == 0 ? 20 - (level - 1) : -20 - level;
        var color = this.shadeColor(this.baseColor, lum / 100);
        
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
            this.game.add.tween(this.labelKeys).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None).start();
            
            // Start Pie Timer
            this.pieTween.onComplete.add(this.timeOut);
            this.pieTween.start();
            
            // Draw puzzle
            this.nextLevel();
        }

        // Stop if game isn't started
        if (!this.firstKey)
            return;
        
        // Check if clicked something
        if (game.input.activePointer.isDown) {
            var touchX = game.input.activePointer.x;
            var touchY = game.input.activePointer.y;
            
            if (this.answerRect.contains(touchX, touchY))
                this.nextLevel();
            else if (this.backRect.contains(touchX, touchY))
                this.timeOut();
        }
    },
    
    // Generate Random Hex Color
    // http://www.paulirish.com/2009/random-hex-color-code-snippets/
    randHex: function () {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);   
    },
    
    // Shade Color 2 (-1.0 to +1.0)
    // http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
    shadeColor: function(color, percent) {   
        var f = parseInt(color.slice(1),16),
            t = percent < 0 ? 0 : 255,
            p = percent < 0 ? percent * -1 : percent,
            R = f >> 16,
            G = f >> 8 & 0x00FF,
            B = f & 0x0000FF;
    
        return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
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
    this.color = color || "#424143";
    
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