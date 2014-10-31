Game.Over = function (game) { };

Game.Over.prototype = {
    create: function () {
        label = game.add.text(w / 2, h / 2, 'game over\n\nscore: '+level+'\n\ntap to\nto restart', { font: '30px Arial', fill: '#000', align: 'center' });   
        label.anchor.setTo(0.5, 0.5);
        
        this.cursor = game.input.keyboard.createCursorKeys();
        this.time = this.game.time.now + 800;
    },
    
    update: function () {
        // Change to if tapped
        if (this.game.time.now > this.time && game.input.activePointer.isDown)
            game.state.start('Play');
    }
}