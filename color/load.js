Game = {};

var w = 350;
var h = 350;
var level = 0;
var time = 11;

function rand (num) {
    return Math.floor(Math.random() * num);   
}

Game.Load = function (game) { };

Game.Load.prototype = {
    preload: function () {
        game.stage.backgroundColor = '#34495e';
        label = game.add.text(w / 2, h / 2, 'loading...', { font: '30px Arial', fill: '#fff' });
        label.anchor.setTo(0.5, 0.5);
        
        // load assets here
    },
    
    create: function () {
        game.state.start('Play');   
    },
}