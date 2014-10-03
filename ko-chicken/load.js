Game = {};

var w = 388;
var h = 360;

var score = 0;

function rand (num) {
    return Math.floor(Math.random() * num);
}

Game.Load = function (game) { };

Game.Load.prototype = {
    preload: function () {
        label = game.add.text(w / 2, h / 2, 'loading...', { font: '30px Arial', fill: '#fff' });
        label.anchor.setTo(0.5, 0.5);
        
        game.load.image('background', 'images/BG.png', 388, 360);
        game.load.spritesheet('chicken_m', 'images/chicken_m.png', 42, 71);
        game.load.spritesheet('hat', 'images/hat.png', 42, 71);
        game.load.spritesheet('monocle', 'images/monocle.png', 42, 71);
        game.load.spritesheet('suit', 'images/suit.png', 42, 71);
        game.load.spritesheet('chicken_suit', 'images/costume.png', 42, 71);
        game.load.spritesheet('chicken_f', 'images/chicken_f.png', 42, 51);
        game.load.spritesheet('taxi', 'images/taxi.png', 40, 30);
        game.load.spritesheet('bush', 'images/bush.png', 50, 32);
    },
    
    create: function () {
        game.state.start('Play');  
    },
}