import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor({ game, x, y, asset }) {
    super(game, x, y, asset);
    this.anchor.setTo(0.5, 0.5);
    this.velocity = {x: 0, y: 0};
    this.rotVelocity = 0;
    this.hp = 3;
    this.randomizeDirection();
  }

  update(delta) {
    this.move();
    this.forceInBounds();
  }

  move() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.angle += this.rotVelocity;
  }

  randomizeDirection() {
      this.velocity = {x: 2*Math.random()-1, y: 2*Math.random()-1};
      this.angle = Math.random()*360;
      this.x = Math.random()*this.game.world.width;
      this.y = Math.random()*this.game.world.height;
      this.rotVelocity = Math.random()*2-1;
  }

  forceInBounds() {
    if (this.x > this.game.world.width || this.x < 0) {
      this.velocity.x *= -1;
      this.rotVelocity = 5*(2*Math.random()-1);
    }
    if (this.y > this.game.world.height || this.y < 0) {
      this.velocity.y *= -1;
      this.rotVelocity = 5*(2*Math.random()-1);
    }
  }

}
