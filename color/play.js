Game.Play = function (game) { };

Game.Play.prototype = {
    create: function () {
        // Initialize Keys
        this.cursor = game.input.keyboard.createCursorKeys();
        // Initialize Graphics Renderer
        this.graphics = game.add.graphics(0, 0);
        
        // Score Label
        this.labelScore = game.add.text(15, 10, 'Time: 20', { font: '20px Arial', fill: '#fff' });
        
        // Start Label
	    this.labelKeys = game.add.text(Math.floor(w / 2) + 1, h - 50, 'tap to begin', { font: '20px Arial', fill: '#fff' });
	    this.labelKeys.anchor.setTo(0.5, 1);
        
        // Internal Timer
        this.gameTime = 0;
        
        // Next-level piece
        this.answerRect = null;
        
        // Game Timer
        time = 21;
        
        // Current Level
        level = 0;
        
        // Start Flag
        this.firstKey = false;
        
        // Last grid color
        this.baseColor = "";
    },
    
    // Time ran out
    timeOut: function () {
        game.state.start('Over');   
    },
    
    // Generate next level
    nextLevel: function() {
        level++;
        
        this.drawGrid(level + 1, level + 1, 30);//270 / (level + 1));
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
    
    // Draw squares in level
    drawGrid: function(width, height, spacing) {
        // Clear screen
        this.graphics.clear();
        
        // Generate level color
        this.baseColor = this.randHex();
        
        // Lighten color for answer piece
        var color = this.colorLuminance(this.baseColor, (20 - level * 1.15) / 100);
        
        // Generate random answer piece
        var answerX = rand(level + 1);
        var answerY = rand(level + 1);
        
        // Add piece to grid
        this.answerRect = new Phaser.Rectangle((answerX * spacing) + 45, (answerY * spacing) + 55, 250 / (level + 1), 250 / (level + 1));
        
        // Draw grid
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                if (x == answerX && y == answerY)
                    this.graphics.beginFill("0x" + color.substr(1));
                else
                    this.graphics.beginFill("0x" + this.baseColor.substr(1), 1);
                
                this.graphics.drawRect((x * spacing) + 45, (y * spacing) + 55, 480 / width, 480 / height);
            }
        }
    },
    
    update: function () {
        // Start game?
        if (game.input.activePointer.isDown && !this.firstKey) {
            this.firstKey = true;
            this.game.add.tween(this.labelKeys).to( { alpha: 0 }, 800, Phaser.Easing.Linear.None).start();
            
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
        
        // Increment Internal Timer
        if (this.game.time.now > this.gameTime) {
            this.gameTime = game.time.now + 1000;
            time -= 1;
            this.labelScore.setText('Time: ' + time);
        }
        
        // Check if game is over
        if (time <= 0)
            this.timeOut();
    },
}
