import Phaser from 'phaser'

const PLAYER_ACCELERATION = .02;
const STARTING_BULLETS = 12;

export default class extends Phaser.Sprite {
  constructor({ game, x, y, asset }) {
    super(game, x, y, asset);
    this.anchor.setTo(0.5, 0.5);
    this.velocity = {x: 0, y: 0};
    this.health = 3;
    this.invulerableTimer = 4000;
    this.alpha = .5;
    this.bullets = 0;
    this.score = 0;
  }

  update(delta) {
    this._handleInput(delta);
    this.move();
    this.forceInBounds();
    this.invulerableTimer-= this.game.getDelta();
  }

  move() {
    this.x += this.velocity.x * this.game.getDelta();
    this.y += this.velocity.y * this.game.getDelta();
  }

  decelerate() {
    this.velocity.x = this.velocity.x *.9;
    this.velocity.y = this.velocity.y *.9;

    if (Math.abs(this.velocity.x) < .05) {
      this.velocity.x = 0;
    }
    if (Math.abs(this.velocity.y) < .05) {
      this.velocity.y = 0;
    }

  }

  forceInBounds() {
    if (this.x > this.game.world.width || this.x < 0) {
      this.velocity.x *= -1;
    }
    if (this.y > this.game.world.height || this.y < 0) {
      this.velocity.y *= -1;
    }
  }

  fire() {
    this.game.addBullets();
  }

  isCollidingWithAnyInArray(array) {
    for (var e of array) {
      if (this.isCollidingWithEntity(e)) {
        return true;
      }
    }
    return false;
  }

  isCollidingWithEntity(entity) {
    var distanceToTarget = Math.sqrt((this.x - entity.x) * (this.x - entity.x) + (this.y - entity.y) * (this.y - entity.y));
    if (distanceToTarget < 45) {
      return true;
    }
    return false;
  }

  isInvulnerable() {
    if (this.invulerableTimer > 0) {
      this.alpha = .3;
    } else {
      this.alpha = 1;
    }
    return this.invulerableTimer > 0;
  }

  setInvulnerable(time) {
    this.invulerableTimer = time;
  }

  useBullet() {
    this.bullets--;
  }

  giveBullets(count) {
    this.bullets += count;
  }

  changeHealth(change) {
    this.health += change;
    if (this.health < 0) { this.health = 0;}
    else if (this.health > 5) { this.health = 5; }
  }

  resetPosition() {
    this.x = this.game.world.centerX;
    this.y = this.game.world.centerY;
    this.velocity.x = 0;
    this.velocity.y = 0;
  }

  isAlive() {
    return this.health > 0;
  }

  _handleInput(delta) {

    let cursors = this.game.input.keyboard.createCursorKeys();

    var wasd = {
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
      rotRight: this.game.input.keyboard.addKey(Phaser.Keyboard.E),
      rotLeft: this.game.input.keyboard.addKey(Phaser.Keyboard.Q),
      lshift: this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT),
      space: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
    };

    var enginesOn = false;

    if (wasd.up.isDown) {
      enginesOn = true;
      this.velocity.y += -PLAYER_ACCELERATION;
    }
    if (wasd.down.isDown) {
      enginesOn = true;
      this.velocity.y += PLAYER_ACCELERATION;
    }
    if (wasd.right.isDown) {
      enginesOn = true;
      this.velocity.x += PLAYER_ACCELERATION;
    }
    if (wasd.left.isDown) {
      enginesOn = true;
      this.velocity.x += -PLAYER_ACCELERATION;
    }
    if (wasd.rotRight.isDown) {
      //this.angle += 2;
    }
    if (wasd.rotLeft.isDown) {
      //this.angle += -2;
    }
    if (wasd.lshift.isDown) {
      enginesOn = true;
      this.decelerate();
    }
    if (wasd.space.isDown) {
      this.fire();
    }

    if (enginesOn) {
      this.game.fireParticleEmitter.x = this.x;
      this.game.fireParticleEmitter.y = this.y;
      this.game.fireParticleEmitter.start(true, 300, null, 1);
      // disable gravity on each particle... TODO, must be a better way to do this
      this.game.fireParticleEmitter.forEach(function (particle) {
        particle.body.allowGravity = false;
      }, this);
    }

  }

}
