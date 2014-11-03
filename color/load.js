Game = {};

var w = window.innerWidth;
var h = window.innerHeight;
var level = 0;

function rand (num) {
    return Math.floor(Math.random() * num);   
}

Game.Load = function (game) { };

Game.Load.prototype = {
    
    preload: function () {
        game.stage.backgroundColor = '#fff';
        label = game.add.text(w / 2, h / 2, 'loading...', { font: '30px Arial', fill: '#424143' });
        label.anchor.setTo(0.5, 0.5);
        
        // load assets here
        game.load.audio('background', ['background.ogg']);
    },
    
    create: function () {
        game.state.start('Menu');   
    },
}
