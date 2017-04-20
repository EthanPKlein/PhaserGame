import Phaser from 'phaser'
import AsteroidDefinitions from '../definitions/asteroidDefinitions'

export default class extends Phaser.Sprite {
  constructor({ game, x, y, asset, type }) {
    super(game, x, y, asset);
    this.anchor.setTo(0.5, 0.5);
    this.rotVelocity = 0;
    this.hp = 1;
    game.physics.arcade.enable(this);
    this.body.setSize(55, 55);
    this.randomizeDirection();
    this.type = type;
    this.hp = AsteroidDefinitions[this.type].hp;
    this.redraw();
  }

  update(delta) {
    this.move();
  }

  move() {
    this.body.x += this.body.velocity.x;
    this.body.y += this.body.velocity.y;
    this.angle += this.rotVelocity;
  }

  randomizeDirection() {
    this.body.velocity.x = 2 * Math.random() - 1;
    this.body.velocity.y = 2 * Math.random() - 1;
    this.angle = Math.random() * 360;
    this.body.x = Math.random() * this.game.world.width;
    this.body.y = Math.random() * this.game.world.height;
    this.rotVelocity = Math.random() * 2 - 1;
  }

  damage(amount) {
    this.hp -= amount;
    this.redraw();
    this.drawDamageParticles();

    if (this.type==="bouncy") {
      this.body.velocity.x = 6 - (12 * Math.random());
      this.body.velocity.y = 6 - (12 * Math.random());
    }

  }

  drawDamageParticles() {
    var particleCount = 3;
    if (this.hp === 0) {
      particleCount = 25;
    }

    this.game.particleEmitter.x = this.body.x + this.body.width / 2;
    this.game.particleEmitter.y = this.body.y + this.body.height / 2;
    this.game.particleEmitter.start(true, 1500, null, particleCount);

    // disable gravity on each particle... TODO, must be a better way to do this
    this.game.particleEmitter.forEach(function (particle) {
      particle.body.allowGravity = false;
    }, this);
  }


  redraw() {
    var newSprite = AsteroidDefinitions[this.type].sprites[this.hp - 1];
    this.loadTexture(newSprite);
  }

}
