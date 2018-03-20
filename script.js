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
Model.prototype.createLaser = function(e) {
    let offsetX = canvas.offsetLeft;
    let offsetY = canvas.offsetTop;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;
    this.addLaser(x,y);
};
Model.prototype.addLaser = function(x,y) {
    this.lasers.push(new Laser(x,y));
};

/*=========================================
THE VIEW : Draws all elements on the page
======================================== */

function View(canvas) {
    this.canvas = canvas;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
};
View.prototype = {
    init: function() {
        this.canvasElement = this.canvas.canvas;
    },
    render: function(enemies, lasers, player) {
        this.canvas.clearRect(0,0,this.width, this.height);
        this.canvas.fillStyle = 'cyan';
        this.canvas.fillRect(0,0,this.width, this.height);
        enemies.forEach(e => {
            e.update();
        });
        lasers.forEach(e => {
            e.update();
        });
        player.update();
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
        //console.log(this.model.player.direction);
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
        let betaEl = document.querySelector('.beta');
        let gammaEl = document.querySelector('.gamma');
        betaEl.innerHTML = this.beta;
        gammaEl.innerHTML = this.gamma;
        this.view.render(this.model.enemies, this.model.lasers, this.model.player);
    },
    weaponInit: function(e) {
        this.model.createLaser(e);
    },
    checkMotion: function() {
        //Check for upwards movement on the phone
        if(this.oldGamma < this.gamma && this.model.player.canJump === true) {
            let dy = this.gamma - this.oldGamma;
            this.dy.innerHTML = dy;
            if(dy > 5) {
                //this.startDate = new Date();
                this.checkingForJump = false;
                this.model.player.jumping = true;
                this.model.player.canJump = false;
                window.setTimeout(this.descend.bind(this),350);
                window.setTimeout(this.reset.bind(this),700);
            }
        //Check for downwards movement on the phone
        }

    },
    descend: function() {
        this.model.player.falling = true;
    },
    reset: function() {
        this.fallingDown = false;
        this.checkingForJump = true;
        this.flicked.innerHTML = '';
        this.model.player.falling = true;
        this.model.player.jumping = false;
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
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let sprite = new Image();
sprite.src = 'images/flash-sprite-small.png';
let posX = window.innerWidth/3;
let posY = window.innerHeight - 228;
let options = {
    numberOfFrames: 6,
    ticksPerFrame: 2
}
let c = document.getElementById('canvas').getContext('2d');
let Player = function(x,y,width,height,color,options) {
    this.x = x;
    this.y = y;
    this.image = sprite;
    this.color = color;
    this.width = width;
    this.spriteWidth = 1000;
    this.spriteHeight = 227;
    this.height = height;
    this.canJump = true;
    this.direction = null;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.numberOfFrames = options.numberOfFrames || 1;
    this.ticksPerFrame = options.ticksPerFrame || 0;
    c.rect(x,y,width,height);
    c.stroke();
};
Player.prototype.draw = function(argument){
    c.drawImage(
           this.image,
           this.frameIndex * this.spriteWidth / this.numberOfFrames,
           0,
           this.spriteWidth / this.numberOfFrames,
           this.spriteHeight,
           this.x,
           this.y,
           this.spriteWidth / this.numberOfFrames,
           this.spriteHeight);
    c.stroke();

};
Player.prototype.update = function() {
    this.tickCount += 1;
    if(this.tickCount > this.ticksPerFrame) {
        this.tickCount = 0;
        if(this.frameIndex < this.numberOfFrames - 1) {
            this.frameIndex += 1;
        } else if(this.frameIndex = this.numberOfFrames) {
            this.frameIndex = 0;
        }
    }
    if(this.direction === 'left') {
        this.x -= 2;
    } else if (this.direction === 'right') {
        this.x += 2;
    } else if (this.direction === 'straight') {
        this.x += 0;
    }
    if (this.x + this.width > canvas.width) {
        this.x -= 2;
    } else if ( this.x < 0 ) {
        this.x += 2;
    }
    if(this.jumping === true) {
        this.y -= 1;
    } else if(this.jumping === false && this.falling === true) {
        this.y += 1;
        if(this.y === (canvas.height-this.spriteHeight)) {
            this.falling = false;
            this.canJump = true;
        }
    }
    this.draw();
};
let Enemy = function(x,y,r,dx,dy,color){
    this.x = x;
    this.y = y;
    this.radius = r;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
    this.width = this.radius * 2;
    this.height = this.radius * 2;
};
Enemy.prototype.addEnemy = function() {
    const radius = (Math.random() * 5) + 5;
    let x = Math.random() * (canvas.width - radius * 2) + radius;
    //let y = Math.random() * (canvas.height - radius * 2) + radius;
    let y = -10;
    //let dx = Math.random() * 2 + 2;
    let dx = 0;
    let dy = Math.random() * 3 + 2;
    enemies.push(new Enemy(x,y, radius, 'black', dy, dy));
};
Enemy.prototype.draw = function(color) {
    c.beginPath();
    c.strokeStyle = color;
    c.arc(this.x,this.y,this.radius, 0, Math.PI * 2, false);
    //c.rect(player.x,player.y,player.size,player.size);
    c.strokeStyle = color;
    c.stroke();
};
Enemy.prototype.update = function() {
    if (this.y > canvas.height) {
        let index = enemies.indexOf(this);
        enemies.splice(index,1);
        const radius = (Math.random() * 5) + 5;
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        //let y = Math.random() * (canvas.height - radius * 2) + radius;
        let y = -10;
        //let dx = Math.random() * 2 + 2;
        let dx = 0;
        let dy = Math.random() * 3 + 2;
        enemies.push(new Enemy(x,y, radius, 'black', dy, dy));
    }
    
    for(let i=0;i<lasers.length;i++) {
        let laser = lasers[i];
        if (this.x < laser.originX + 25 &&
           this.x + this.width > laser.originX &&
           this.y < laser.originY + 25 &&
           this.height + this.y > laser.originY) {
            let index = lasers.indexOf(laser);
            lasers.splice(index,1);
            this.destroyed = true;
            let particleIndex = enemies.indexOf(this);
            enemies.splice(particleIndex,1);
        }
    }
    //this.x += this.dx;
    this.y += this.dy;
    this.draw(this.color);
};
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

let enemies = [new Enemy(50,-10,10,4,4,'blue'),new Enemy(150,-10,10,4,4,'blue'),new Enemy(250,-10,10,4,4,'blue'),];
let lasers = [];
let player = new Player(posX,posY,250,340,'black', options);
let model = new Model(player, enemies, lasers);
let view = new View(c);
let controller = new Controller(model,view);
controller.init();

})();