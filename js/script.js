(function() {

'use strict'

/*=====================================
THE MODEL: Controls the game variables
=====================================*/

function Model(player, enemies, lasers) {
    this.player = player;
    this.enemies = enemies;
    this.lasers = lasers;
};
Model.prototype = {
    createLaser: function(e) {
        let offsetX = canvas.offsetLeft;
        let offsetY = canvas.offsetTop;
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
        this.addLaser(x,y);
    },
    addLaser: function(x,y) {
       // this.lasers.push(new Laser(x,y));
    }

}

/*=========================================
THE VIEW : Draws all elements on the page
======================================== */

function View(canvas, model) {
    this.canvas = canvas;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mainMenu = document.querySelector('.menu');
    this.leftMenu = document.querySelector('.menu--left');
    this.rightMenu = document.querySelector('.menu--right');
    this.rightMenuItems = document.querySelectorAll('.menu--item-right');
    this.leftMenuItems = document.querySelectorAll('.menu--item-left');
    this.menuItems = document.querySelectorAll('.menu--item');
    this.speedMeter = document.querySelector('.speed-meter');
    this.menuButtons = document.querySelector('.btn--container');
    this.menuSubs = document.querySelectorAll('.menu--sub');
    this.startButton = document.querySelector('.btn--start');
    this.leftMenuButtons = document.querySelectorAll('.btn--menu');
};
View.prototype = {
    init: function() {
        this.canvasElement = this.canvas.canvas;
        this.attachListeners();
        this.canvasElement.addEventListener('touchstart', this.beginTouchEvent.bind(this), false);
        this.canvasElement.addEventListener('touchmove', this.touchEvent.bind(this), false);
        this.canvasElement.addEventListener('touchend', this.endTouchEvent.bind(this), false);
    },
    attachListeners: function() {
        this.menuButtons.addEventListener('click', this.menuControls.bind(this), false);
        this.startButton.addEventListener('click', this.startGame.bind(this), false);
        this.menuItems.forEach(e => {
            e.addEventListener('click', this.menuItemControls.bind(this), false);
        });
    },
    startGame: function() {
        this.mainMenu.classList.add('menu--disabled');
    },
    menuControls: function(e) {
        let target = e.target.getAttribute('data-target');
        this.leftMenuButtons.forEach(e => {
            e.classList.remove('active');
        });
        e.target.classList.add('active');
        this.menuSubs.forEach(e => {
            let receiver = e.getAttribute('data-receiver');
            if(receiver === target) {
                e.classList.add('active');
            } else {
                e.classList.remove('active');
            }
        });
    },
    menuItemControls: function(e) {
        console.log(e.target)
    },
    beginTouchEvent: function(event) {
        this.touchstartx = event.touches[0].pageX;
        this.timestart = new Date().getTime();
    },
    speedMeterValue: function(value) {
        this.speedMeter.style.width = value + 'px';
    },
    touchEvent: function(event) {
        this.touchmovex = event.touches[0].pageX;    
    },
    endTouchEvent: function(event) {
        let moveDistance = this.touchstartx - this.touchmovex;
        if(moveDistance < 0) {
            this.swipeDirection = 'right';
        } else if (moveDistance > 0) {
            this.swipeDirection = 'left';
        }
        this.timeEnd = new Date().getTime();
        this.swipeTime = this.timeEnd - this.timestart;

        if(this.swipeTime < 500) {
            if(this.touchstartx < 100 && this.swipeDirection === 'right') {
                this.leftMenu.classList.add('active');
                this.leftMenuItems.forEach(item => {
                    item.classList.add('active');
                });
            } else if(this.touchstartx < 250 && this.swipeDirection === 'left') {
                this.leftMenu.classList.remove('active');
                this.leftMenuItems.forEach(item => {
                    item.classList.remove('active');
                });
            } else if(this.touchstartx > (this.width - 100) && this.swipeDirection === 'left') {
                this.rightMenu.classList.add('active');
                this.rightMenuItems.forEach(item => {
                    item.classList.add('active');
                });
            } else if(this.touchstartx > (this.width - 250) && this.swipeDirection === 'right') {
                this.rightMenu.classList.remove('active');
                this.rightMenuItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
        }
    },
    render: function(enemies, lasers, player) {
        this.canvas.clearRect(0,0,this.width, this.height);
        this.canvas.fillStyle = 'skyblue';
        this.canvas.fillRect(0,0,this.width, this.height);
        lasers.forEach(e => {
            e.update();
        });
        player.update();
        enemies.forEach(e => {
            e.update();
        });
        this.speedMeterValue(player.speed);
    },
    showLeftMenu: function(e) {
    }
};

/* ======================================
THE CONTROLLER: Talks to the model and view
========================================= */

function Controller(model, view) {
    this.model = model;
    this.view = view;
}
Controller.prototype = {
    init: function() {
        this.view.init();
        this.render();
        this.checkingForJump = true;
        this.fallingDown = false;
        this.canvas = this.view.canvas.canvas;
        window.addEventListener('resize', this.resizeCanvas.bind(this), false);
        window.addEventListener('deviceorientation', this.checkRotation.bind(this), false);
        window.setInterval(this.checkMotion.bind(this),16);
        this.canvas.addEventListener('click', this.weaponInit.bind(this), false);
        this.alphaEl = document.querySelector('.alpha');
        this.betaEl = document.querySelector('.beta');
        this.gammaEl = document.querySelector('.gamma');
        this.flicked = document.querySelector('.flicked');
        this.dy = document.querySelector('.dy');
    },
    resizeCanvas: function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    render: function() {
        //Checks the phone orientation
        window.requestAnimationFrame(this.render.bind(this));
        if(this.beta <= -5 && this.beta >= -20) {
            this.model.player.direction = 'left';
        } else if (this.beta > 5 && this.beta <= 20) {
            this.model.player.direction = 'right';
        } else if (this.beta <= 5 && this.beta > -4) {
            this.model.player.direction = 'straight';
        }
        if(this.direction === 'jumped') {
            this.model.player.direction = 'jumped';
        }
        this.oldBeta = this.beta;
        this.oldGamma = this.gamma;
        this.oldAlpha = this.alpha;
        let speedEl = document.querySelector('.speed--info');
        speedEl.innerHTML = this.model.player.speed;
        this.view.render(this.model.enemies, this.model.lasers, this.model.player);
    },
    weaponInit: function(e) {
        this.model.createLaser(e);
    },
    checkMotion: function() {
        //Check for upwards movement on the phone
        if(this.oldGamma < this.gamma && this.model.player.canJump === true) {
            let dy = this.gamma - this.oldGamma;
            if(dy > 5) {
                //this.startDate = new Date();
                this.checkingForJump = false;
                this.model.player.jumping = true;
                this.model.player.canJump = false;
                window.setTimeout(this.descend.bind(this),500);
                window.setTimeout(this.reset.bind(this),700);
            }
        //Check for downwards movement on the phone
        }

    },
    descend: function() {
        this.model.player.falling = true;
        this.model.player.jumping = false;
    },
    reset: function() {
        this.fallingDown = false;
        this.checkingForJump = true;
        this.model.player.falling = true;
    },
    checkRotation: function(e) {
        this.alpha = e.alpha;
        this.beta = e.beta;
        this.gamma = e.gamma;
        this.direction = 'straight';
    },
};

/*====================================
    Global variables and game objects
=====================================*/

let canvas = document.getElementById('canvas');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
let sprite = new Image();
let background = new Image();
let spriteJumping = new Image();
let powerItem = new Image();
powerItem.src = 'images/power2.png';
let negativePower = new Image();
negativePower.src = 'images/negativePower.png';
spriteJumping.src = 'images/sprite-jump.png';
sprite.src = 'images/flash-sprite-final2.png';
background.src = 'images/road.png';
let colors = ['red','lime','dodgerblue','cyan'];

let options = {
    numberOfFrames: 6,
    numberOfRows: 5,
    ticksPerFrame: 2,
    numberOfBackgroundFrames: 1,
    ticksPerBackgroundFrame: 3
}
let c = document.getElementById('canvas').getContext('2d');

let Player = function(x,y,width,height,color,options) {
    this.x = x;
    this.y = y;
    this.xAfter = x;
    this.yAfter = y;
    this.image = sprite;
    this.speed = 200;
    this.afterImageActive = true;
    this.imageJump = spriteJumping;
    this.background = background;
    this.color = color;
    this.width = width;
    this.spriteWidth = 750;
    this.xSize = width;
    this.direction = 'straight';
    this.backgroundWidth = 2700;
    this.spriteHeight = 170;
    this.backgroundHeight = canvas.height;
    this.height = height;
    this.canJump = true;
    this.frameIndex = 0;
    this.rowIndex = 0;
    this.tickCount = 0;
    this.phaseLevel = 1;
    this.numberOfFrames = options.numberOfFrames || 1;
    this.numberOfRows = options.numberOfRows || 1;
    this.ticksPerFrame = options.ticksPerFrame || 0;
    this.frameIndexBG = 0;
    this.tickCountBG = 0;
    this.numberOfBackgroundFrames = options.numberOfBackgroundFrames || 1;
    this.ticksPerBackgroundFrame = options.ticksPerBackgroundFrame || 0;
};
Player.prototype.draw = function(argument){
    c.drawImage(
           this.image,
           this.frameIndex * this.spriteWidth / this.numberOfFrames,
           this.rowIndex * this.spriteHeight,
           this.spriteWidth / this.numberOfFrames,
           this.spriteHeight,
           this.x,
           this.y,
           this.spriteWidth / this.numberOfFrames,
           this.spriteHeight);
};
Player.prototype.afterImage = function() {
    if(this.direction === 'left') {
        this.xSize += 1;
    } else if(this.direction === 'right') {
        this.xSize += 2;
        this.xAfter -= 1;
    } else if(this.direction === 'straight') {
        this.xAfter -= 1;
        this.xSize += 2;
    }
    if(this.xSize > 300) {
        this.xSize = this.width;
    }
    /*
    if(this.direction === 'left' && this.x < 5) {
        this.xAfter -=3;

    }
    if(this.direction === 'right' && this.x > (canvas.width - this.width - 5)) {
        this.xAfter +=3;

    }*/
    if(this.yAfter >= this.y || this.yAfter > (this.y-50)) {
        this.yAfter +=2;
    } else if (this.yAfter < this.y) {
    }
    if (this.yAfter >= canvas.height) {
        this.yAfter = this.y;
        this.xAfter = this.x;
        this.xSize = this.width;
    }
    //Draw the jump sprite afterimage while jumping
    if(this.jumping === true || this.falling === true) {
        c.drawImage(
           this.imageJump,
           0,
           0,
           this.spriteWidth / this.numberOfFrames,
           this.spriteHeight,
           this.xAfter,
           this.yAfter,
           this.xSize,
           this.spriteHeight);
    } else {
        //Draw the normal sprite afterimage if not jumping
        c.drawImage(
               this.image,
               this.frameIndex * this.spriteWidth / this.numberOfFrames,
               0,
               this.spriteWidth / this.numberOfFrames,
               this.spriteHeight,
               this.xAfter,
               this.yAfter,
               this.xSize,
               this.spriteHeight);
    }
};
Player.prototype.drawJumping = function() {
    c.drawImage(
           this.imageJump,
           this.x,
           this.y,
           125,
           170);
};
Player.prototype.drawBackground = function() {
    c.drawImage(
           this.background,
           this.frameIndexBG * this.backgroundWidth / this.numberOfBackgroundFrames,
           0,
           this.backgroundWidth / this.numberOfBackgroundFrames,
           this.backgroundHeight,
           0,
           70,
           this.backgroundWidth / this.numberOfBackgroundFrames,
           this.backgroundHeight);
};
Player.prototype.update = function() {
    this.tickCount += 1;
    this.tickCountBG += 1;
    //Updates through the player sprite
    if(this.tickCount > this.ticksPerFrame) {
        this.tickCount = 0;
        if(this.frameIndex < this.numberOfFrames - 1) {
            this.frameIndex += 1;
        } else if(this.frameIndex = this.numberOfFrames) {
            this.frameIndex = 0;
        }
    }
    if(this.direction === 'straight') {
        this.rowIndex = 0;
        if(this.speed > 300 && this.speed <= 350) {
            this.rowIndex = 1;
            this.phaseLevel = 2;
        } else if (this.speed > 350) {
            this.rowIndex = 2;
            this.phaseLevel = 3;
        }
    } else if(this.direction === 'right') {
        this.rowIndex = 4;

    } else if(this.direction === 'left') {
        this.rowIndex = 3;
    }
    //Updates through the background sprite sheet
    if(this.tickCountBG > this.ticksPerBackgroundFrame) {
        this.tickCountBG = 0;
        if(this.frameIndexBG < this.numberOfBackgroundFrames - 1) {
            this.frameIndexBG += 1;
        } else if(this.frameIndexBG = this.numberOfBackgroundFrames) {
            this.frameIndexBG = 0;
        }
    }
    //Move the flash in a direction depending on the phone tilt
    if(this.direction === 'left') {
        this.x -= 2;
    } else if (this.direction === 'right') {
        this.x += 2;
    } else if (this.direction === 'straight') {
        this.x += 0;
    }
    //Prevents the player from running too far right and left
    if (this.x + this.width > canvas.width) {
        this.x -= 2;
    } else if ( this.x < 0 ) {
        this.x += 2;
    }
    //Detect for fast upwards movement to start jump animation
    if(this.jumping === true) {
        this.y -= 1;
    } else if(this.jumping === false && this.falling === true) {
        this.y += 1;
        if(this.y <= (canvas.height-this.spriteHeight + 1) && this.y >= (canvas.height-this.spriteHeight)) {
            this.falling = false;
            this.canJump = true;
        }
    }
    this.drawBackground();

    //Draw the after images while jumping or running.
    if(this.jumping === true || this.falling === true) {
        this.drawJumping();
    } else {
        this.draw();
    }
    if(this.afterImageActive === true) {
        for(let i=0;i<10;i++) {
            this.afterImage();
        }
    }
};
let Enemy = function(x,y,r,dx,dy,color,image,width){
    let itemSrc = new Image();
    if(color === 'blue') {
        itemSrc.src = 'images/negativePower.png';
    } else {
        itemSrc.src = 'images/power2.png';
    }
    this.x = x;
    this.y = y;
    this.image = itemSrc;
    this.radius = r;
    this.dx = dx;
    this.dy = dy;
    this.item = true;
    this.color = color;
    this.width = width;
    this.height = width;
};
Enemy.prototype.addEnemy = function() {
    const radius = (Math.random() * 5) + 5;
    radius > 7.5 ? this.item = false : this.item = true;
    let color;
    let image ='images/power.png';
    color = radius > 7.5 ? 'red' : 'blue';
    if(color === 'blue') {
        image = 'images/negativePower.png';
    }
    let x = Math.floor(Math.random() * ((canvas.width/2)))
    //let y = Math.random() * (canvas.height - radius * 2) + radius;
    let y = 50;
    //let dx = Math.random() * 2 + 2;
    let dx = 0;
    let dy = Math.random() * 3 + 2;
    enemies.push(new Enemy(x,y,radius,dx,dy,color,image,5));
};
Enemy.prototype.draw = function(color) {
    c.beginPath();
    // c.strokeStyle = this.color;
    c.arc(this.x,this.y,this.radius, 0, Math.PI * 2, false);
    //c.rect(player.x,player.y,player.size,player.size);
    // c.stroke();
    c.drawImage(
       this.image,
       0,
       0,
       40,
       40,
       this.x,
       this.y,
       this.width,
       this.height
    );
};
Enemy.prototype.update = function() {
    if (this.y > canvas.height) {
        let index = enemies.indexOf(this);
        let color;
        enemies.splice(index,1);
        const radius = (Math.random() * 5) + 5;
        let x = Math.floor(Math.random() * ((canvas.width/2 + 50) - (canvas.width/2 - 50)) + (canvas.width/2 - 50));
        //let y = Math.random() * (canvas.height - radius * 2) + radius;
        let y = 50;
        color = radius > 7.5 ? 'red' : 'blue';
        //let dx = Math.random() * 2 + 2;
        let dx = Math.random() < 0.5 ? -.2 : .2;
        let dy = 1;
        let width = 5;
        let image = 'images/power.png';
        enemies.push(new Enemy(x,y,radius,dx,dy,color,image,width));
    }
    this.randomNum = function(min,max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    this.itemSpeed = Math.pow(this.y, 1.5)/this.randomNum(1400,2000);

    //Basic collisions detection
    for(let i=0;i<enemies.length;i++) {
        let enemy = enemies[i];
        if (enemy.x < player.x + 72 &&
            enemy.x + enemy.width > player.x &&
            enemy.y < player.y + 85 &&
            enemy.height + enemy.y > player.y) {
            let index = enemies.indexOf(enemy);
            enemies.splice(index,1);
            enemy.destroyed = true;
            if(enemy.color === 'red') {
                player.speed += 10;
            } else if(enemy.color === 'blue') {
                player.speed -= 20;
            }
            this.addEnemy();
        }
    }
    if(player.direction === 'left') {
        this.x += .5;
        //this.y += this.dy;
        this.y += this.itemSpeed;
        //this.x = 200;
    } else if(player.direction === 'right') {
        this.x -= .5;
        //this.y += this.dy;
        this.y += this.itemSpeed;
        //this.x = 200;
    } else if(player.direction === 'straight') {
        this.x += this.dx;
        //this.y += this.dy;
        this.y += this.itemSpeed;
        //this.x = 200;
    }
    this.width += .1;
    this.height += .1;
    this.draw(this.color);
};
/*
let Laser = function(x,y) {
    this.targetX = x;
    this.targetY = y;
    this.height = canvas.height - this.targetY;
    if(this.targetX < (canvas.width/2)) {
        this.width = this.targetX;
        this.originX = Math.floor(25);
        this.originY = Math.floor(canvas.height - 25);
    } else {
        this.width = canvas.width - this.targetX;
        this.originX = Math.floor(canvas.width - 25);
        this.originY = Math.floor(canvas.height - 25);
    }
    this.magnitude = Math.sqrt(this.width * this.width + this.height * this.height);
    this.dx = this.width / this.magnitude * 10;
    this.dy = this.height / this.magnitude * 10;
};
Laser.prototype.addLaser = function(e) {
    let offsetX = canvas.offsetLeft;
    let offsetY = canvas.offsetTop;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;
    //lasers.push(new Laser(x,y));
};
Laser.prototype.update = function() {
    if(this.targetX < (canvas.width/2)) {
        this.originX += this.dx;
    } else {
        this.originX -= this.dx;
    }
    this.originY -= this.dy;
    this.originX = Math.floor(this.originX);
    this.originY = Math.floor(this.originY);
    if(this.originX < 0 || this.originX > canvas.width) {
        let index = lasers.indexOf(this);
        lasers.splice(index,1);
    } else {
        this.draw();
    }
};
Laser.prototype.draw = function(color){
    c.beginPath();
    c.strokeStyle="blue";
    c.rect(this.originX,this.originY,25,25);
    c.stroke();
};
*/
let enemies = [];
for(let i=0;i<3;i++) {
    let enemyX = Math.floor(Math.random() * ((canvas.width/2 + 50) - (canvas.width/2 - 50)) + (canvas.width/2 - 50));
    let enemyDx = Math.random() < 0.5 ? -.2 : .2;
    let enemyDy = 1;
    const radius = (Math.random() * 5) + 5;
    let color;
    let width = 5;
    let image = 'images/power.png';
    color = radius > 7.5 ? 'red' : 'blue';
    if(color === 'blue') {
        image = 'images/negativePower.png';
    }
    enemies.push(new Enemy(enemyX,50,radius,enemyDx,enemyDy,color,image,width));
}
let posX = canvas.offsetWidth/3;
let posY = canvas.offsetHeight - 170;
let lasers = [];
let player = new Player(posX,posY,125,170,'black', options);
let model = new Model(player, enemies, lasers);
let view = new View(c, model);
let controller = new Controller(model,view);
controller.init();
})();