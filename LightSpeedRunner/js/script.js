(function() {

'use strict'

/*=====================================
THE MODEL: Controls the game variables
=====================================*/

function Model(player, enemies, lightning) {
    this.player = player;
    this.enemies = enemies;
    this.lightning = lightning;
    this.gameStarted = false;
    this.gamePaused = false;
    this.gameLevel = 1;
    this.itemSpeedMin = 2500;
    this.itemSpeedMax = 3000;
};
Model.prototype = {
    createLightning: function(e) {
        let offsetX = canvas.offsetLeft;
        let offsetY = canvas.offsetTop;
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
        this.addLightning(this.player.x, this.player.y,x,y);
    },
    addLightning: function(x0,y0,x1,y1) {
        this.lightning.push(new Lightning(x0,y0,x1,y1));
    },
    addEnemy: function() {
        let enemyX = Math.floor(Math.random() * ((canvas.width/2 + 25) - (canvas.width/2 - 25) + 1) + (canvas.width/2 - 25));
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
        this.model.enemies.push(new Enemy(enemyX,70,radius,enemyDx,enemyDy,color,image,width));   
    }

}

/*=========================================
THE VIEW : Draws all elements on the page
======================================== */

function View(canvas, model) {
    this.canvas = canvas;
    this.model = model;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.showControls = false;
    // Main menu functions and buttons
    this.mainMenu = document.querySelector('.menu');
    this.menuButtons = document.querySelector('.btn--container');
    this.startButton = document.querySelector('.btn--start');
    this.leftMenuButtons = document.querySelectorAll('.btn--menu');
    // In game menu functions and buttons
    this.leftMenu = document.querySelector('.menu--left');
    this.rightMenu = document.querySelector('.menu--right');
    this.rightMenuItems = document.querySelectorAll('.menu--item-right');
    this.leftMenuItems = document.querySelectorAll('.menu--item-left');
    this.menuItems = document.querySelectorAll('.menu--item');
    this.menuSubs = document.querySelectorAll('.menu--sub');
    // Heads up display    
    this.speedMeter = document.querySelector('.speed-meter');
    this.gameLevel = document.querySelector('.level--value');
    this.speedGoal = document.querySelector('.speed--goal');
    this.menuSlider = document.querySelector('.menu--controls');
    this.speedDisplayValue =  document.querySelector('.speed--info');
    this.gameOver = document.querySelector('#gameover');
    this.startOverButton = document.querySelector('#startover');
    this.returnToMainMenuButton = document.querySelector('#returnToMainMenuBtn');
};
View.prototype = {
    init: function() {
        this.canvasElement = this.canvas.canvas;
        this.attachListeners();
        this.addEnemies();
        this.leftMenu.addEventListener('touchstart', this.beginTouchEvent.bind(this),false);
        this.leftMenu.addEventListener('touchmove', this.touchEvent.bind(this), false);
        this.leftMenu.addEventListener('touchend', this.endTouchEvent.bind(this), false);
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
        this.gameOver.addEventListener('click', this.gameOverMenu.bind(this), false);
    },
    gameOverMenu: function(e) {
        let target = e.target.getAttribute('data-function');
        switch(target) {
            case 'startover':
                this.gameOver.classList.remove('active');
                this.model.enemies = [];
                this.model.player.speed = 200;
                this.speedDisplayValue.innerHTML = 200;
                this.gameLevel.innerHTML = 1;
                model.gameLevel = 1;
                this.speedGoal.innerHTML = 300;
                this.startGame();
                break;
            case 'returnToMainMenu':
                this.mainMenu.classList.remove('menu--disabled');
                this.gameOver.classList.remove('active');
                this.model.gamePaused = true;
                this.gameLevel.innerHTML = 1;
                model.gameLevel = 1;
                this.speedGoal.innerHTML = 300;
                this.menuSlider.classList.remove('game--active', 'active');
                this.model.enemies = [];
                this.model.player.speed = 200;
                this.speedDisplayValue.innerHTML = 200;
                break;
            default:
                break;
        }
    },
    addEnemies: function() {
        for(let i=0;i<3;i++) {
            let enemyX = Math.floor(Math.random() * ((canvas.width/2 + 25) - (canvas.width/2 - 25) + 1) + (canvas.width/2 - 25));
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
            this.model.enemies.push(new Enemy(enemyX,70,radius,enemyDx,enemyDy,color,image,width));  
        }
    },
    startGame: function() {
        const width = window.innerWidth;
        if (width > 1024) {
            alert('This game is for mobile devices only.')
        } else {
            this.mainMenu.classList.add('menu--disabled');
            this.gameOver.classList.remove('active');
            this.gameLevel.innerHTML = 1;
            this.speedGoal.innerHTML = 300;
            this.model.gamePaused = false;
            model.enemies = [];
            this.addEnemies();
        }
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
        let button = e.target.getAttribute('data-function');
        switch(button) {
            case 'quit':
                this.mainMenu.classList.remove('menu--disabled');
                this.model.gamePaused = true;
                this.menuSlider.classList.remove('game--active', 'active');
                this.model.enemies = [];
                this.model.player.speed = 200;
                this.speedDisplayValue.innerHTML = 200;
                break;
            case 'pause':
                this.model.gamePaused = !this.model.gamePaused;
                this.menuSlider.classList.remove('game--active', 'active');
                break;
            case 'controls':
                this.model.gamePaused = !this.model.gamePaused;
                this.menuSlider.classList.toggle('active');
                this.menuSlider.classList.toggle('game--active');
                this.leftMenu.classList.remove('active');
                break;
            case 'perception':
                break;
            case 'lightning':
                break;
            case 'phase':
                break;
            default:
                break;
        }
    },
    beginTouchEvent: function(event) {
        this.touchstartx = event.touches[0].pageX;
        this.timestart = new Date().getTime();
    },
    speedMeterValue: function(value) {
        this.speedMeter.style.width = value/5 + 'px';
    },
    touchEvent: function(event) {
        this.touchmovex = event.touches[0].pageX;
        this.swipeActive = true;  
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
        if(this.swipeTime < 500 && this.swipeActive === true) {
            if(this.touchstartx < 100 && this.swipeDirection === 'right') {
                this.leftMenu.classList.add('active');
                this.leftMenuItems.forEach(item => {
                    item.classList.add('active');
                });
            } else if(this.touchstartx < 400 && this.swipeDirection === 'left') {
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
        this.touchmovex = 0;
        this.swipeActive = false;
    },
    render: function(enemies, lightning, player) {
        this.canvas.clearRect(0,0,this.width, this.height);
        this.canvas.fillStyle = 'black';
        this.canvas.fillRect(0,0,this.width, this.height);
        background.update();
        lightning.forEach(e => { 
            e.update();
        });
        player.update();
        if(model.gameStarted === true && enemies.length > 0) {
            enemies.forEach(e => {
                e.update();
            });
        }
        if(model.gameStarted === true && enemies.length === 0) {
            this.addEnemies();
        }
        if(model.player.speed < 100) {
            this.gameOver.classList.add('active');
        }
        if(model.player.speed === model.player.speedTarget) {
            model.player.speedTarget += 100;
            model.gameLevel += 1;
            model.itemSpeedMin -= 200;
            model.itemSpeedMax -= 200;
            if(model.itemSpeedMin === 600) {
                model.itemSpeedMin += 200;
                model.itemSpeedMax += 200;
            }
            model.player.gameLevel += 1;
            this.speedGoal.innerHTML = model.player.speedTarget;
            this.gameLevel.innerHTML = model.gameLevel;
        }
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
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', this.checkRotation.bind(this), false);
        } else {
            let supportMenu = document.querySelector('.menu--supported');
            supportMenu.classList.add('active');
        }
        window.setInterval(this.checkMotion.bind(this),16);
        this.canvas.addEventListener('click', this.weaponInit.bind(this), false);
    },
    resizeCanvas: function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.view.width = window.innerWidth;
        this.view.height = window.innerHeight;
        this.model.player.y = window.innerHeight - 170;
        console.log(this.canvas.width)
    },
    render: function() {
        //Checks the phone orientation
        window.requestAnimationFrame(this.render.bind(this));
        if(this.model.gamePaused === false) {
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
            if(this.view.mainMenu.classList.contains('menu--disabled')) {
                this.model.gameStarted = true;
            }
            this.view.render(this.model.enemies, this.model.lightning, this.model.player);
            
        }
    },
    weaponInit: function(e) {
        if(this.model.player.canFireLightning === true) {
            this.model.createLightning(e);
            this.model.player.canFireLightning = false;
            window.setTimeout(this.weaponEnd.bind(this), 500);
        } else {
            console.log('lightning recharging')
        }
    },
    weaponEnd: function() {
        this.model.lightning = [];
        this.model.player.canFireLightning = true;
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

let powerItem = new Image();
powerItem.src = 'images/power2.png';
let negativePower = new Image();
negativePower.src = 'images/negativePower.png';
let colors = ['red','lime','dodgerblue','cyan'];

let options = {
    numberOfFrames: 6,
    numberOfRows: 5,
    ticksPerFrame: 2,
    numberOfBackgroundFrames: 1,
    ticksPerBackgroundFrame: 3
}
let c = canvas.getContext('2d');

let Player = function(x,y,width,height,color,options) {
    //Position properties
    this.x = x;
    this.y = y;
    this.xAfter = x;
    this.yAfter = y;
    this.height = height;
    this.width = width;
    //Image properties
    this.playerImage = new Image();
    this.playerImage.src = 'images/flash-sprite-final2.png';
    this.playerJumpImage = new Image();
    this.playerJumpImage.src = 'images/sprite-jump.png';
    this.afterImageActive = true;
    this.spriteWidth = 750;
    this.xSize = width;
    this.spriteHeight = 170;
    this.frameIndex = 0;
    this.rowIndex = 0;
    this.tickCount = 0;
    this.canFireLightning = true;
    this.numberOfFrames = options.numberOfFrames || 1;
    this.numberOfRows = options.numberOfRows || 1;
    this.ticksPerFrame = options.ticksPerFrame || 0;
    //Attribute properties
    this.speed = 200;
    this.color = color;
    this.direction = 'straight';
    this.canJump = true;
    this.phaseLevel = 1;
    this.speedTarget = 300;
    this.gameLevel = 1;
    this.shadowBlur = 0;
    this.shadowColor = 'yellow';

};
Player.prototype.draw = function(argument){
    switch(this.gameLevel) {
        case 1:
            this.shadowBlur = 0;
            break;
        case 2:
            this.shadowBlur = 1;
            break;
        case 3: 
            this.shadowBlur = 2;
            this.shadowColor = 'red';
            break;
        case 4:
            this.shadowBlur = 3;
            this.shadowColor = 'red';
            break;
        case 5:
            this.shadowBlur = 5;
            this.shadowColor = 'red';
            break;
        default:
            break;
    }
    c.shadowColor = this.shadowColor;
    c.shadowBlur = this.shadowBlur;
    c.drawImage(
           this.playerImage,
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
    c.shadowColor = this.shadowColor;
    c.shadowBlur = this.shadowBlur;
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
        c.shadowBlur = this.shadowBlur;
        c.shadowColor = this.shadowColor;
        c.drawImage(
           this.playerJumpImage,
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
               this.playerImage,
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
    c.shadowBlur = this.shadowBlur;
    c.shadowColor = this.shadowColor;
    c.drawImage(
           this.playerJumpImage,
           this.x,
           this.y,
           125,
           170);
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
        if(this.y === (window.innerHeight-this.spriteHeight + 1)) {
            this.falling = false;
            this.canJump = true;
        }
    }
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

/* =======================================
======= BACKGROUND CANVAS ================
=========================================*/

let BackgroundCanvas = function() {
    this.background = new Image();
    this.spaceBackground = new Image();
    this.background.src = 'images/road-sprite.png';
    this.spaceBackground.src = 'images/space-background.png';
    this.backgroundWidth = 900;
    this.backgroundHeight = 396;
    this.frameIndex = 0;
    this.tickCount = 0;
    this.numberOfBackgroundFrames = 10;
    this.ticksPerBackgroundFrame = 1;
    this.spaceBackgroundIndex = 0;
};
BackgroundCanvas.prototype.update = function() {
    this.tickCount += 1;
    this.spaceBackgroundIndex += .25;
    if(this.tickCount > this.ticksPerBackgroundFrame) {
        this.tickCount = 0;
        if(this.frameIndex < this.numberOfBackgroundFrames - 1) {
            this.frameIndex += 1;
        } else if(this.frameIndex = this.numberOfBackgroundFrames) {
            this.frameIndex = 0;
        }
    }
    if(this.spaceBackgroundIndex > this.spaceBackground.width - canvas.width) {
        this.spaceBackgroundIndex = 0;
    }
    this.drawBackground();
};
BackgroundCanvas.prototype.drawBackground = function() {
    c.shadowBlur = 0;
    c.drawImage(
        this.spaceBackground,
        this.spaceBackgroundIndex,
        0,
        canvas.width,
        this.spaceBackground.height,
        0,
        0,
        canvas.width,
        canvas.height)
    c.drawImage(
           this.background,
           0,
           this.frameIndex * this.backgroundHeight,
           this.backgroundWidth,
           this.backgroundHeight,
           0,
           70,
           canvas.width,
           canvas.height)
};

/* ==================================
=============ENEMY OBJECT ==============
========================================*/

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
    let x = Math.floor(Math.random() * ((canvas.width/2 + 25) - (canvas.width/2 - 25) + 1) + (canvas.width/2 - 25));
    //let y = Math.random() * (canvas.height - radius * 2) + radius;
    let y = 70;
    //let dx = Math.random() * 2 + 2;
    let dx = 0;
    let dy = Math.random() * 3 + 2;
    model.enemies.push(new Enemy(x,y,radius,dx,dy,color,image,5));
};
Enemy.prototype.draw = function(color) {
    c.beginPath();
    // c.strokeStyle = this.color;
    c.arc(this.x,this.y,this.radius, 0, Math.PI * 2, false);
    c.shadowBlur = 0;
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
        let indexModel = model.enemies.indexOf(this);
        let color;
        enemies.splice(index,1);
        model.enemies.splice(indexModel,1);
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
        this.addEnemy();
        //enemies.push(new Enemy(x,y,radius,dx,dy,color,image,width));
    }
    if(model.enemies.length < 3) {
        this.addEnemy();
    }
    this.randomNum = function(min,max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    //this.itemSpeed = Math.pow(this.y, 1.5)/this.randomNum(1400,2000);
    this.itemSpeed = Math.pow(this.y, 1.5)/this.randomNum(model.itemSpeedMin,model.itemSpeedMax);
    //Collisions detection for items
    for(let i=0;i<model.enemies.length;i++) {
        let enemy = model.enemies[i];
        if (enemy.x < player.x + 72 &&
            enemy.x + enemy.width > player.x &&
            enemy.y < player.y + 85 &&
            enemy.height + enemy.y > player.y) {
            let index = model.enemies.indexOf(enemy);
            model.enemies.splice(index,1);
            enemy.destroyed = true;
            if(enemy.color === 'red') {
                player.speed += 10;
            } else if(enemy.color === 'blue') {
                player.speed -= 20;
            }
            this.addEnemy();
        }
    }
    //Collision detection for the lightning
    /*
    for(let i=0;i<model.lightning.length;i++) {
        let lightning = model.lightning[i];
        console.log(lightning)
        if (this.x < lightning.targetX + 25 &&
           this.x + this.width > lightning.targetX &&
           this.y < lightning.targetY + 25 &&
           this.height + this.y > lightning.targetY) {
            model.lightning[0].drawExplosion();
            window.setTimeout(this.removeLightning.bind(this),100);
        }
    }*/
    this.removeLightning = function() {
        let index = model.lightning.indexOf(lightning);
        model.lightning.splice(index,1);
        this.destroyed = true;
        let particleIndex = model.enemies.indexOf(this);
        model.enemies.splice(particleIndex,1);
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

let Lightning = function(originX,originY,targetX,targetY) {
    this.targetX = targetX;
    this.targetY = targetY;
    this.originX = originX + (player.width/2);
    this.originY = originY + (player.height/2);
    this.steps = 1;
    this.distanceY = Math.abs(this.originY - this.targetY);
    this.distanceX = Math.abs(this.targetX - this.originX);
    this.paths = [];
    this.randomX = this.originX;
    this.randomY = this.originY;
    //Explosion properties
    this.blastRadius = 15;
    this.frameIndexExplosion = 0;
    this.tickCountExplosion = 0;
    this.numberOfExplosionFrames = 6;
    this.ticksPerExplosionFrame = 1;
    this.explosionImage = new Image();
    this.explosionImage.src = 'images/ExplosionSprite.png';
    this.explosionWidth = 768;
    this.explosionHeight = 128;

    //Determine the direction of the lightning bolt
    if(this.targetX < (canvas.width/2)) {
        this.direction = -1;
    } else {
        this.direction = 1;
    }
    if(this.targetY > this.originY) {
        this.directionY = -1;
    } else {
        this.directionY = 1;
    }
    this.stepWidth = this.distanceX / 15;
    this.stepHeight = this.distanceY / 15;
    this.paths.push({x: this.originX, y: this.originY});
};
Lightning.prototype.addLightning = function(x0,y0,x1,y1) {
    let offsetX = canvas.offsetLeft;
    let offsetY = canvas.offsetTop;
    this.originX = x0;
    this.originY = y0;
    this.targetX = x1;
    this.targetY = y1;
    //lightning.push(new Laser(x,y));
};
Lightning.prototype.update = function() {
    //Create the different points of the lightning bolt segments}
    if(this.steps < 15) {
        let maxX = this.originX + (this.stepWidth * (this.steps) * this.direction);
        let minX = this.originX + (this.stepWidth * (this.steps-1) * this.direction)
        let maxY = this.originY - (this.stepHeight * (this.steps+3) * this.directionY);
        let minY = this.originY - (this.stepHeight * (this.steps-1) * this.directionY);
        this.randomX = Math.floor(Math.random() * (maxX - minX + 1) + minX);
        this.randomY = Math.floor(Math.random() * (maxY - minY + 1) + minY);
        this.paths[this.steps] = ({x: this.randomX, y: this.randomY});
    }
    if(this.steps === 15) {
        this.paths.push({x: this.targetX, y: this.targetY});
        this.beginExplosion = true;
    }    
    if(this.beginExplosion === true) {
        //Detect collision for lightning bolts and items
        model.enemies.forEach(e => {
            for(let i=0;i<model.enemies.length;i++) {
                let enemies = model.enemies[i];
                if (this.targetX < enemies.x + 15 &&
                   this.targetX + this.blastRadius > enemies.x &&
                   this.targetY < enemies.y + 15 &&
                   this.blastRadius + this.targetY > enemies.y) {
                    let particleIndex = model.enemies.indexOf(enemies);
                    model.enemies.splice(particleIndex,1);
                }
            }
        });
        this.tickCountExplosion += 1;
        //The explosion animation
        if(this.tickCountExplosion > this.ticksPerExplosionFrame) {
            this.tickCountExplosion = 0;
            if(this.frameIndexExplosion < this.numberOfExplosionFrames - 1) {
                this.frameIndexExplosion += 1;
            } else if(this.frameIndexExplosion = this.numberOfExplosionFrames) {
                this.frameIndexExplosion = 0;
            }
        }
        this.drawExplosion();
    }
    this.draw();
    this.steps++;
};
Lightning.prototype.draw = function(color){
    c.beginPath();
    c.lineWidth = Math.floor(Math.random() * (4 - 0 + 1) + 1);
    c.strokeStyle='yellow';
    c.shadowColor = 'red';
    c.shadowBlur = 15;
    this.currentPlayerX = model.player.x + (player.width/2);
    this.currentPlayerY = model.player.y + (player.height/2);
    c.moveTo(this.currentPlayerX, this.currentPlayerY);
    for(let i=0;i<this.paths.length;i++) {
        c.lineTo(this.paths[i].x, this.paths[i].y);
    }
    c.stroke();
};
Lightning.prototype.drawExplosion = function(){
    c.shadowBlur = 0;
    c.drawImage(
           this.explosionImage,
           this.frameIndexExplosion * this.explosionWidth / this.numberOfExplosionFrames,
           0,
           this.explosionWidth / this.numberOfExplosionFrames,
           this.explosionHeight,
           this.targetX - 64,
           this.targetY - 64,
           this.explosionWidth / this.numberOfExplosionFrames,
           this.explosionHeight); 
};

let enemies = [];
let posX = canvas.offsetWidth/3;
let posY = window.innerHeight - 170;
let lightning = [];
let background = new BackgroundCanvas();
let player = new Player(posX,posY,125,170,'black', options);
let model = new Model(player, enemies, lightning);
let view = new View(c, model);
let controller = new Controller(model,view);
    controller.init();

})();