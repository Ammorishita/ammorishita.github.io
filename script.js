(function(){
'use strict';
let canvas = document.getElementById('canvas');
let c = document.getElementById('canvas').getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let player;
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
let colors = ['red','lime','dodgerblue','cyan'];

var gyroPresent = false;
window.addEventListener("devicemotion", function(event){
    if(event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma)
        gyroPresent = true;
});

let app = {
    init: function() {
        window.addEventListener('keydown', this.playerMove, false);
        canvas.addEventListener('click', this.cannon, false);
        this.particles = null;
        this.lasers = [];
        player = new this.Player(350, 350, 50, 'lime');
        this.createParticles();
        this.animateParticles();
        //this.difficulty();
    },
    randomNum(min,max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    randomColor(colors) {
        return colors[Math.floor(Math.random() * colors.length)];       
    },
    cannon: function(e) {
        let offsetX = canvas.offsetLeft;
        let offsetY = canvas.offsetTop;
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
        app.createLaser(x,y);
    },
    createLaser: function(x,y) {
        this.lasers.push(new this.Laser(x,y));
        app.lasers.forEach(laser => {
            laser.draw();
        });
    },
    createParticles: function() {
        this.particles = [];
        for(let i=0;i < 5; i++) {
            const radius = (Math.random() * 5) + 5;
            let x = Math.random() * (canvasWidth - radius * 2) + radius;
            //let y = Math.random() * (canvasHeight - radius * 2) + radius;
            let y = -10;
            //let dx = Math.random() * 2 + 2;
            let dx = 0;
            let dy = Math.random() * 3 + 2;
            this.particles.push(new this.Particle(x,y, radius, 'black', dy, dy));
        }
    },
    difficulty: function() {
        setInterval(function() {
            const radius = (Math.random() * 5) + 5;
            let x = Math.random() * (canvasWidth - radius * 2) + radius;
            //let y = Math.random() * (canvasHeight - radius * 2) + radius;
            let y = -10;
            //let dx = Math.random() * 2 + 2;
            let dx = 0;
            let dy = Math.random() * 3 + 2;
            app.particles.push(new app.Particle(x,y, radius, 'black', dy, dy));           
        },1500)
    },
    animateParticles: function() {
        requestAnimationFrame(app.animateParticles);
        c.clearRect(0,0,canvasWidth, canvasHeight);
        c.fillStyle = 'cyan';
        c.fillRect(0,0,canvasWidth, canvasHeight);
        if(app.lasers.length > 0) {
            app.lasers.forEach(laser => {
                laser.update();
            });
        }
        app.particles.forEach(particle => {
            particle.update();
            particle.collision();
        });
    },
    Laser: function(x,y) {
        this.targetX = x;
        this.targetY = y;
        this.height = canvasHeight - this.targetY;
        if(this.targetX < (canvasWidth/2)) {
            this.width = this.targetX;
            this.originX = Math.floor(25);
            this.originY = Math.floor(canvasHeight - 25);
        } else {
            this.width = canvasWidth - this.targetX;
            this.originX = Math.floor(canvasWidth - 25);
            this.originY = Math.floor(canvasHeight - 25);
        }
        this.magnitude = Math.sqrt(this.width * this.width + this.height * this.height);
        this.dx = this.width / this.magnitude * 10
        this.dy = this.height / this.magnitude * 10
        this.update = function() {
            if(this.targetX < (canvasWidth/2)) {
                this.originX += this.dx;
            } else {
                this.originX -= this.dx;
            }
            this.originY -= this.dy;
            this.originX = Math.floor(this.originX);
            this.originY = Math.floor(this.originY);
            if(this.originX < 0 || this.originX > canvasWidth) {
                let index = app.lasers.indexOf(this);
                app.lasers.splice(index,1);
            } else {
                this.draw();
            }
        },
        this.draw = function() {
            c.beginPath();
            c.strokeStyle="blue";
            c.rect(this.originX,this.originY,25,25);
            c.stroke();
        }  
    },
    Player: function(x,y,size,color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        c.rect(x,y,size,size);
        c.stroke();
        this.update = function(e) {
            switch(e) {
                //Left, Right, Up, Down
                case(37):
                    this.x -= 25;
                    break;
                case(39):
                    this.x += 25;
                    break;
                case(38):
                    this.y -= 25;
                    break;
                case(40):
                    this.y += 25;
                    break;
                default:
                    break;
            }
            if (this.x + this.size > canvasWidth || this.x - this.size < 0) {
                this.x = this.x;
            }
            if (this.y + this.size > canvasHeight|| this.y - this.size < 0) {
                this.y = this.y;
            }
        }
        this.draw = function() {
            c.rect(this.x,this.y,size,size);
            c.strokeStyle(color)
            c.stroke();     
        }        
    },
    playerMove: function(e) {
        switch(e.keyCode){
            //Left,Right,Up,Down
            case(37):
                player.update(37);
                break;
            case(39):
                player.update(39);
                break;
            case(38):
                player.update(38);
                break;
            case(40):
                player.update(40);
                break;
            default:
                break;
        }
    },
    Particle: function(x,y,r,color,dx,dy) {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
        this.width = this.radius * 2;
        this.height = this.radius * 2;
        this.draw = function(color) {
            c.beginPath();
            c.strokeStyle = color;
            c.arc(this.x,this.y,this.radius, 0, Math.PI * 2, false);
            c.rect(player.x,player.y,player.size,player.size);
            c.strokeStyle = color;
            c.stroke();
        },
        this.update = function() {
            /*
            if (this.x + this.radius > canvasWidth || this.x - this.radius < 0) {
                this.dx = -this.dx;
            }
            if (this.y + this.radius > canvasHeight || this.y - this.radius < 0) {
                this.dy = -this.dy;
            }*/
            if (this.y > canvasHeight) {
                let index = app.particles.indexOf(this);
                app.particles.splice(index,1);
                const radius = (Math.random() * 5) + 5;
                let x = Math.random() * (canvasWidth - radius * 2) + radius;
                //let y = Math.random() * (canvasHeight - radius * 2) + radius;
                let y = -10;
                //let dx = Math.random() * 2 + 2;
                let dx = 0;
                let dy = Math.random() * 3 + 2;
                app.particles.push(new app.Particle(x,y, radius, 'black', dy, dy));
            }
            for(let i=0;i<app.lasers.length;i++) {
                let laser = app.lasers[i];
                if (this.x < laser.originX + 25 &&
                   this.x + this.width > laser.originX &&
                   this.y < laser.originY + 25 &&
                   this.height + this.y > laser.originY) {
                    let index = app.lasers.indexOf(laser);
                    app.lasers.splice(index,1);
                    this.destroyed = true;
                    let particleIndex = app.particles.indexOf(this);
                    app.particles.splice(particleIndex,1);
                }
            }
            //this.x += this.dx;
            this.y += this.dy;
            this.draw(this.color);
        },
        this.collision = function() {
            let currentPosX = Math.floor(this.x);
        }
    }
}
app.init();
})();