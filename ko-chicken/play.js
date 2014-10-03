// Shake Camera
var shakeWorld = 0;
var shakeWorldMax = 20;
var shakeWorldTime = 0;
var shakeWorldTimeMax = 40;

// Restrictions
var isMoving = false;
var isDead = false;

Game.Play = function (game) { };

Game.Play.prototype = {
    create: function () {
        // Add Background (Level)
        game.add.tileSprite(0, 0, 388, 360, 'background');
        
        // Add Controls
        this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.upKey.onDown.add(this.movePlayerUp, this);
        
        this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.downKey.onDown.add(this.movePlayerDown, this);
        
        this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.leftKey.onDown.add(this.movePlayerLeft, this);
        
        this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.rightKey.onDown.add(this.movePlayerRight, this);
        
        // Add Enemies
        this.taxies = game.add.group();
        this.taxies.createMultiple(30, 'taxi');
        this.taxies.setAll('outOfBoundsKill', true);
        // Enemy Spawn Timer
        this.enemyTime = 0;
        
        // Level End Goal
        this.goal = game.add.sprite(338, Math.floor(Math.random() * h - 42), 'chicken_f');
        
        // Create Player
        this.player = game.add.sprite(36, h / 2, 'chicken_m');
        this.player.anchor.setTo(0.5, 0.5);
        
        // Display Score
        this.labelScore = game.add.text(15, 10, 'score: ' + score, { font: '20px Arial', fill: '#fff' });
        
        // Reset Restrictions
        isMoving = false;
        isDead = false;
    },
    
    // Movement Functions
    movePlayerUp: function (key) {
        if (isMoving)
            return;
        
        isMoving = true;
        
        game.add.tween(this.player).to( { x: this.player.x, y: this.player.y - 48 }, 150, Phaser.Easing.Quadratic.InOut, true).onComplete.add(function () {
           isMoving = false; 
        }, this);
    },
    
    movePlayerDown: function (key) {
        if (isMoving)
            return;
        
        isMoving = true;
        
        game.add.tween(this.player).to( { x: this.player.x, y: this.player.y + 48 }, 150, Phaser.Easing.Quadratic.InOut, true).onComplete.add(function () {
           isMoving = false; 
        }, this);
    },
    
    movePlayerLeft: function (key) {
        if (isMoving)
            return;
        
        isMoving = true;
        
        game.add.tween(this.player).to( { x: this.player.x - 36, y: this.player.y }, 150, Phaser.Easing.Quadratic.InOut, true).onComplete.add(function () {
           isMoving = false; 
        }, this);
    },
    
    movePlayerRight: function (key) {
        if (isMoving)
            return;
        
        isMoving = true;
        
        game.add.tween(this.player).to( { x: this.player.x + 36, y: this.player.y }, 150, Phaser.Easing.Quadratic.InOut, true).onComplete.add(function () {
           isMoving = false; 
        }, this);
    },
    
    // Next Level
    // Increment Score,
    // Reset State
    nextLevel: function (player, goal) {
        score += 1;
        
        game.state.start('Play');
    },
    
    // Spawn a New Taxi
    newTaxi: function () {
        // Random Spawn Time
        this.enemyTime = game.time.now + (1500 / (score * 0.5));
    
        // Choose Random Car
        if (Math.floor(Math.random() * 2) == 1)
            var enemy = this.taxies.getFirstExists(false);
        else
            var enemy = this.taxies.getFirstExists(false);

        enemy.anchor.setTo(0.5, 0.5);
        
        // Choose Random Lane
        var rand = Math.floor(Math.random() * 2);
        
        if (rand == 0)
            enemy.reset(180, 0);
        else
            enemy.reset(270, 0);
        
        // Move Car Down Lane
        this.game.add.tween(enemy).to( { x: enemy.x, y: 400 }, 3000, Phaser.Easing.Linear.None).start();
    },
    
    // Kill Player,
    // Game Over
    hitPlayer: function (player, enemy) {
        isMoving = true;
        
        // Move, Rotate Player
        // Shake Screen
        game.add.tween(player).to( { x: w / 2, y: h / 2}, 300, Phaser.Easing.Linear.InOut, true).onUpdateCallback(function () { 
            player.angle += 20;
            player.scale.x += 0.3; 
            player.scale.y += 0.3; 
        }, this).onComplete.add(function () { 
            shakeWorldTime = shakeWorldTimeMax;
            isDead = true;
        }, this);
    },
    
    // Game Loop
    update: function () {
        // Dead?
        // Shake Screen,
        // Display Game Over
        if (isDead) {
            if (shakeWorldTime > 0) {
                var magnitude = ( shakeWorldTime / shakeWorldTimeMax ) * shakeWorldMax;
                var rand1 = game.rnd.integerInRange(-magnitude,magnitude);
                var rand2 = game.rnd.integerInRange(-magnitude,magnitude);
                game.world.setBounds(rand1, rand2, game.width + rand1, game.height + rand2);
                shakeWorldTime--;

                if (shakeWorldTime == 0)
                    game.world.setBounds(0, 0, game.width, game.height); // normalize after shake?
            }
            
            label = game.add.text(w / 2, h / 2, 'game over\n\nscore: '+score+'\n\npress the UP arrow key\nto restart', { font: '30px Arial', fill: '#fff', align: 'center' });   
            label.anchor.setTo(0.5, 0.5);
            
            if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                score = 0;
                game.state.start('Play');
            }
        // Not Dead.
        // Check Collisions,
        // Spawn New Enemies
        } else {
            if (!isMoving) {
                game.physics.overlap(this.player, this.goal, this.nextLevel);
                game.physics.overlap(this.player, this.taxies, this.hitPlayer);
            }

            if (this.game.time.now > this.enemyTime)
                this.newTaxi();
        }
    },
}