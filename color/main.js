var game = new Phaser.Game(w, h, Phaser.AUTO, 'game_div');

game.state.add('Load', Game.Load);
game.state.add('Menu', Game.Menu);
game.state.add('Tutorial', Game.Tutorial);
game.state.add('Play', Game.Play);
game.state.add('Over', Game.Over);

game.state.start('Load');