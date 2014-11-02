Game.Over = function (game) { };

Game.Over.prototype = {
    create: function () {
        // Add Congrats
        this.titleFontSize = h * 0.047; // 90
        this.titleTop = h * 0.226; //435
        
        var titleStyle = {
            font: this.titleFontSize.toString() + 'px "Varela Round"',
            fill: '#424143'
        };
        
        this.titleLabel = game.add.text(Math.floor(w / 2), this.titleTop, 'Congrats', titleStyle);
        this.titleLabel.anchor.setTo(0.5, 0);
        
        // Add Score
        this.scoreTop = 830;
        
        this.scoreLabel = game.add.text(Math.floor(w / 2), this.scoreTop, level * 10, titleStyle);
        this.scoreLabel.anchor.setTo(0.5, 0);
        
        // Create Option Style
        this.optionFontSize = h * 0.036; // 70
        
        var optionStyle = {
            font: this.optionFontSize.toString() + 'px "Varela Round"',
            fill: '#424143'
        };
        
        // Add Your Score
        this.yscoreTop = h * 0.347; // 660
        
        this.yscoreLabel = game.add.text(Math.floor(w / 2), this.yscoreTop, "Your Score:", optionStyle);
        this.yscoreLabel.anchor.setTo(0.5, 0);
        
        // Add Play
        this.playTop = h * 0.678; // 1300
        
        this.playLabel = game.add.text(Math.floor(w / 2), this.playTop, "Play Again", optionStyle);
        this.playLabel.anchor.setTo(0.5, 0);
        this.playRect = new Phaser.Rectangle(this.playLabel.x, this.playLabel.y, this.playLabel.width, this.playLabel.height);
        
        // Add Menu
        this.menuTop = h * 0.781; // 1500
        
        this.menuLabel = game.add.text(Math.floor(w / 2), this.menuTop, "Main Menu", optionStyle);
        this.menuLabel.anchor.setTo(0.5, 0);
        this.menuRect = new Phaser.Rectangle(this.menuLabel.x, this.menuLabel.y, this.menuLabel.width, this.menuLabel.height);
        
        // Add Squares
        this.graphics = game.add.graphics(0, 0);
        
        // Play Squares
        this.squareSize = h * 0.020; // 40
        this.squareTop = ((this.playLabel.y + this.playLabel.height) - (this.playLabel.height / 2)) - (this.squareSize / 2);
        this.squareRightA = (this.playLabel.x - this.menuLabel.width / 2) - (this.squareSize * 2);
        this.squareRightB = (this.playLabel.x + this.playLabel.width / 2) + this.squareSize;
        
        this.graphics.beginFill('0xffdcad');
        this.graphics.drawRect(this.squareRightA, this.squareTop, this.squareSize, this.squareSize);
        this.graphics.drawRect(this.squareRightB, this.squareTop, this.squareSize, this.squareSize);
        
        // Menu Squares
        this.squareTop = ((this.menuLabel.y + this.menuLabel.height) - (this.menuLabel.height / 2)) - (this.squareSize / 2);
        this.squareRightA = (this.menuLabel.x - this.menuLabel.width / 2) - (this.squareSize * 2);
        this.squareRightB = (this.menuLabel.x + this.menuLabel.width / 2) + this.squareSize;
        
        this.graphics.beginFill('0xdceeda');
        this.graphics.drawRect(this.squareRightA, this.squareTop, this.squareSize, this.squareSize);
        this.graphics.drawRect(this.squareRightB, this.squareTop, this.squareSize, this.squareSize);
        
        this.time = this.game.time.now + 800;
    },
    
    update: function () {
        // Check if clicked something
        if (this.game.time.now > this.time && game.input.activePointer.isDown) {
            var touchX = game.input.activePointer.x;
            var touchY = game.input.activePointer.y;
            
            if (this.playRect.contains(touchX, touchY))
                game.state.start('Play');
            else if (this.menuRect.contains(touchX, touchY))
                game.state.start('Menu');
        }  
    },
}