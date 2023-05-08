class Player {
    constructor(id, username, x, y) {
        this.id = id;
        this.username = username;

        this.position = {
            x: x,
            y: y
        };
        this.speed = {
            x: 0,
            y: 0
        };

        this.radius = 30;
        this.step = 2;
        this.maxSpeed = 6;
    }

    update() {
        this.applySpeed();
        this.applyFriction();
        this.capSpeed();
    }

    // ### FUNCTIONS ### //

    applySpeed() {
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
    }

    applyFriction() {
        let friction = 0.8;
        this.speed.x += -Math.sign(this.speed.x) * friction;
        this.speed.y += -Math.sign(this.speed.y) * friction;

        if(Math.abs(this.speed.x) < friction) this.speed.x = 0;
        if(Math.abs(this.speed.y) < friction) this.speed.y = 0;
    }

    capSpeed() {
        if(this.speed.x > this.maxSpeed) this.speed.x = this.maxSpeed;
        if(this.speed.x < -this.maxSpeed) this.speed.x = -this.maxSpeed;

        if(this.speed.y > this.maxSpeed) this.speed.y = this.maxSpeed;
        if(this.speed.y < -this.maxSpeed) this.speed.y = -this.maxSpeed;
    }
}

module.exports = Player;