Game.Menu = function (game) { };

Game.Menu.prototype = {
    create: function () {
        // Add Title
        this.titleFontSize = h * 0.0416; // 80 (4.16% of height)
        this.titleTop = h * 0.104; // 200
        
        var titleStyle = {
            font: this.titleFontSize.toString() + 'px "Varela Round"',
            fill: '#424143'
        };
        
        this.titleLabel = game.add.text(Math.floor(w / 2), this.titleTop, 'q u i c k  f l i p', titleStyle);
        this.titleLabel.anchor.setTo(0.5, 0);
        
        // Initialize Graphics Renderer
        this.graphics = game.add.graphics(0, 0);
        
        // Create Menu Style
        this.squareRight = w * 0.111;
        this.squareSize = h * 0.039;
        this.textFontSize = h * 0.039; // 75 (3.9% of height)
        
        var textStyle = {
            font: this.textFontSize.toString() + 'px "Varela Round"',
            fill: '#424143'
        };
        
        // Add Line
        //this.graphics.moveTo(this.titleLabel.x, this.titleTop + this.titleLabel.height);
        //this.graphics.lineTo(this.titleLabel.x + this.titleLabel.width, this.titleTop + this.titleLabel.height);
        
        // Add Play
        this.textTop = h * 0.304; // 585
        this.textRight = w * 0.315; // 340
        
        this.playLabel = game.add.text(this.textRight, this.textTop, "Play", textStyle);
        this.playRect = new Phaser.Rectangle(this.textRight, this.textTop, this.playLabel.width, this.playLabel.height);
        
        // Add Play Square
        this.graphics.beginFill('0xfad5e5');
        this.graphics.drawRect(this.squareRight, this.textTop, this.squareSize, this.squareSize);
        
        // Add Tutorial
        this.textTop = h * 0.476; // 915
        this.textRight = w * 0.315; // 340
        
        this.tutorialLabel = game.add.text(this.textRight, this.textTop, "Tutorial", textStyle);
        this.tutorialRect = new Phaser.Rectangle(this.textRight, this.textTop, this.tutorialLabel.width, this.tutorialLabel.height);
        
        // Add Tutorial Square
        this.graphics.beginFill('0xd6e8f7');
        this.graphics.drawRect(this.squareRight, this.textTop, this.squareSize, this.squareSize);
    },
    
    update: function() {
        // Check if clicked something
        if (game.input.activePointer.isDown) {
            var touchX = game.input.activePointer.x;
            var touchY = game.input.activePointer.y;
            
            if (this.playRect.contains(touchX, touchY))
                game.state.start('Play');
            else if (this.tutorialRect.contains(touchX, touchY))
                game.state.start('Tutorial');
        }  
    },
};