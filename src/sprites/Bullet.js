import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor({ game, x, y, asset }) {
    super(game, x, y, asset);
    this.anchor.setTo(0.5);
    this.velocity = {x: 0, y: 0};
    this.rotVelocity = 0;
  }

  update(delta) {
    this.move();
  }

  move() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  isOutOfBounds() {
      if (this.x > this.game.world.width || this.x < 0) {
          return true;
      }
      if (this.y > this.game.world.height || this.y < 0) {
          return true;
      }
  }

  isCollidingWithEntity(entity) {
    var distanceToTarget = Math.sqrt((this.x - entity.x)*(this.x - entity.x) + (this.y - entity.y)*(this.y - entity.y));
    if (distanceToTarget < 5) {
      return true;
    }
    return false;
  }

}
