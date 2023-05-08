class Player {
    constructor(id, username, isTagged, x, y) {
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

        this.isTagged = isTagged;
        this.maxBlinkTime = 200;
        this.blinkTime = 0;
        this.blinkFrequency = 10;
        this.doRender = true;
    }

    update() {
        this.applySpeed();
        this.applyFriction();
        this.capSpeed();

        this.updateBlinkTime();
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

    tag(byWho) {
        this.isTagged = true;
        byWho.isTagged = false;

        byWho.blink();
    }

    collideWith(other) {
        if(this.blinkTime > 0 || other.blinkTime > 0) return;
        if(this.isTagged) other.tag(this);
        else if(other.isTagged) this.tag(other);
    }

    blink() {
        this.blinkTime = this.maxBlinkTime;
    }

    updateBlinkTime() {
        if(this.blinkTime <= 0) {
            this.doRender = true;
            return;
        }

        this.blinkTime--;
        if(this.blinkTime % this.blinkFrequency == 0) this.doRender = !this.doRender;
    }
}

module.exports = Player;