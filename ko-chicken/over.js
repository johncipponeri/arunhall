Game.Over = function (game) { };

Game.Over.prototype = {
    create: function () {
        game.add.tileSprite(0, 0, 388, 360, 'win');
    }
}