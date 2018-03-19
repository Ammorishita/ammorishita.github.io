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
    this.height = 400;
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
        this.stopMeasuringUp = false;
        this.stopMeasuringDown = false;
        this.canvas = this.view.canvas.canvas;
        window.addEventListener('deviceorientation', this.checkRotation.bind(this), false);
        window.setInterval(this.checkMotion.bind(this),50);
        this.canvas.addEventListener('click', this.weaponInit.bind(this), false);
        this.alphaEl = document.querySelector('.alpha');
        this.betaEl = document.querySelector('.beta');
        this.gammaEl = document.querySelector('.gamma');
        this.flicked = document.querySelector('.flicked');
    },
    render: function() {
        //console.log(this.model.player.direction);
        window.requestAnimationFrame(this.render.bind(this));
        if(this.gamma <= -5 && this.gamma >= -20) {
            this.model.player.direction = 'left';
        } else if (this.gamma > 5 && this.gamma <= 20) {
            this.model.player.direction = 'right';
        } else if (this.gamma <= 5 && this.gamma > -4) {
            this.model.player.direction = 'straight';
        }
        this.oldBeta = this.beta;
        this.view.render(this.model.enemies, this.model.lasers, this.model.player);
    },
    weaponInit: function(e) {
        this.model.createLaser(e);
    },
    checkMotion: function() {
        if(this.oldBeta < this.beta) {
            if(this.stopMeasuringUp === false) {
                this.startDate = new Date();
                this.stopMeasuringUp = true;
            }
        } else if (this.oldBeta > this.beta) {
            if(this.stopMeasuringDown === false) {
                this.endDate = new Date();
                this.stopMeasuringDown = true;                
            }
            let seconds = (this.endDate.getTime() - this.startDate.getTime());
            if(seconds > 60 && seconds < 200) {
                console.log('flicked the phone up')
                this.flicked.innerHTML = 'jumped!';
            }
            window.setTimeout(this.reset.bind(this),350);
        }
    },
    reset: function() {
        this.stopMeasuringDown = false;
        this.stopMeasuringUp = false;
        this.flicked.innerHTML = '';
    },
    checkRotation: function(e) {
        this.alpha = e.alpha;
        this.beta = e.beta;
        this.gamma = e.gamma;
        this.direction = 'straight';
        this.alphaEl.innerHTML = this.alpha;
        this.betaEl.innerHTML = this.beta;
        this.gammaEl.innerHTML = this.gamma;
    },
};

/*====================================
    Global variables and game objects
=====================================*/

let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = 400;
let c = document.getElementById('canvas').getContext('2d');
let Player = function(x,y,size,color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.direction = null;
    c.rect(x,y,size,size);
    c.stroke();
};
Player.prototype.draw = function(argument){
    c.rect(this.x,this.y,this.size,this.size);
    c.stroke();     
};
Player.prototype.update = function() {
    if(this.direction === 'left') {
        this.x -= 2;
    } else if (this.direction === 'right') {
        this.x += 2;
    } else if (this.direction === 'straight') {
        this.x += 0;
    }
    if (this.x + this.size > canvas.width) {
        this.x -= 2;
    } else if ( this.x < 0 ) {
        this.x += 2;
    }
    if(this.direction === 'jump') {

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
let player = new Player(200,350,50,'black');
let model = new Model(player, enemies, lasers);
let view = new View(c);
let controller = new Controller(model,view);
controller.init();

})();