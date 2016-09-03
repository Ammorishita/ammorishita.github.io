//Display instructions
$(document).ready(function() {
    document.getElementById("score").innerHTML = player.score;
    var click = true;
    $(".menu").click(function() {
        if(click) {
            $(".instructions").css({ display: "block"})
            click = false;
        } else {
            $(".instructions").css({ display: "none"}) 
            click = true;
        }
    });
    var mute = true;
    $("#mute").click(function() {
        if(mute) {
            document.getElementById('audio').muted = true;
            mute = false;
        } else {
            document.getElementById('audio').muted = false;
            mute = true;;
        }
    });
});

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = -100;
    this.y = 225;
    this.speed = 500;
    this.enemystartsY = [55, 140, 225, 310, 395, 480];
    this.addEnemy = function() {
        allEnemies.push(new Enemy());
    };
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};



// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    var endposX = 1000;
    var startposX = -100;
    var stonerows = 6;
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (Math.floor(dt * Math.random() * this.speed));
    if (this.x > endposX) {
        this.x = startposX;
        //Selects which y pos the enemy will start at once it reaches the end.
        var newPos = Math.floor(Math.random() * stonerows);
        this.y = this.enemystartsY[newPos];
    };
    /* Collision detection. If player position and enemy position are around equal, player is moved
    back to starting location and score resets to 0.*/
    if ((this.y === player.y)&&(this.x < (player.x + 50))&&(this.x > (player.x - 75))) {
        player.gameOver(); 
        document.getElementById("score").innerHTML = player.score; 
    };

};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.x = 404;
    this.y = 565;
    this.score = 0;
    this.sprite = "images/char-boy.png";
    this.gameOver = function() {
        this.x = 404;
        this.y = 565;
        this.score--;
    };
    this.restart = function() {
        this.x = 404;
        this.y = 565;
    };
};


//Updating players position.
Player.prototype.update = function(dt){


};
//Drawing the player on the screen.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);   
};
//Moving player left right up or down based on key pressed.
Player.prototype.handleInput = function(key) {
    switch(key) {
        case 'up':
            if (this.y < 61) {
                this.y = 565
                this.x = 404;
                enemy.addEnemy();
                this.score++;
                document.getElementById("score").innerHTML = player.score;
            } else {
                this.y -= 85;
            }
            break;

        case 'down':
            if (this.y >= 650) {
                this.y += 0;
            } else {
                this.y += 85;
            }
            break;

        case 'left':
            if (this.x < 85) {
                this.x -= 0;
            } else {
                this.x -= 101;
            }
            break;

        case 'right':
            if (this.x >= 900) {
                this.x += 0;
            } else {
                this.x += 101;
            }
            break;
    };
};

var Items = function() {
    this.x = -100;
    this.y= 225;
    this.sprite = 'images/dark-gem.png';
};
//When player "collects" items, some event happens.
Items.prototype.update = function(dt){

    this.x = this.x + (Math.floor(dt * Math.random() * 700));
        if (this.x > 1000) {
            this.x = -100;
            //Selects which y pos the item will start at once it reaches the end.
            var newPos = Math.floor(Math.random() * 6);
            this.y = enemy.enemystartsY[newPos];
        };
        if ((this.y === player.y)&&(this.x < (player.x + 50))&&(this.x > (player.x - 75))) {
        enemy.addEnemy();
        player.restart();
    };

};

Items.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
var player = new Player();
var item = new Items();
var enemy = new Enemy();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
