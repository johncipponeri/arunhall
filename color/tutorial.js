Game.Tutorial = function (game) { };

Game.Tutorial.prototype = {
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
        
        // Add Text
        this.textFontSize = h * 0.026; // 50 (2.6% of height)
        this.textTop = h * 0.304; // 585
        this.textW = w * 0.768; // 830
        
        var text = "Flip all of the differently colored tiles on the board\r\rMove from board to board as quickly as possible to increase points earned\r\rCompleting a board adds time to the clock\r\r\Compete versus firends to get the most points"
        
        var textStyle = {
            font: this.textFontSize.toString() + 'px "Varela Round"',
            fill: '#949698'
        };
        
        this.textLabel = game.add.text(Math.floor(w / 2), this.textTop, text, textStyle);
        this.textLabel.wordWrap = true;
        this.textLabel.wordWrapWidth = this.textW;
        this.textLabel.anchor.setTo(0.5, 0);
        
        // Initialize Graphics Renderer
        //this.graphics = game.add.graphics(0, 0);
        //this.graphics.beginFill('#000');
        
        // Add Line
        //this.graphics.moveTo(this.titleLabel.x, this.titleTop + this.titleLabel.height);
        //this.graphics.lineTo(this.titleLabel.x + this.titleLabel.width, this.titleTop + this.titleLabel.height);
    },
};