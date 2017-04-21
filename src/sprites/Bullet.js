import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor({ game, x, y, asset, type }) {
    super(game, x, y, asset);
    this.anchor.setTo(0.5, 0.5);
    this.velocity = {x: 0, y: 0};
    this.rotVelocity = 0;
    this.type = type;
    

    if (type === 'strong') {
      this.loadTexture('bulletStrong');
      this.hp = 2;
      this.damage = 2;
    } else {
      this.loadTexture('bullet');
      this.hp = 1;
      this.damage = 1;
    }

  }

  update() {
    var delta = 
    this.move(this.game.getDelta());
  }

  move(delta) {
    this.x += this.velocity.x * delta;
    this.y += this.velocity.y * delta;
  }

  isOutOfBounds() {
      if (this.x > this.game.world.width || this.x < 0) {
          return true;
      }
      if (this.y > this.game.world.height || this.y < 0) {
          return true;
      }
  }

  getDamage() {
    return this.damage;
  }

  isCollidingWithEntity(entity) {
    var distanceToTarget = Math.sqrt((this.x - entity.x)*(this.x - entity.x) + (this.y - entity.y)*(this.y - entity.y));
    if (distanceToTarget < 30) {
      return true;
    }
    return false;
  }

}
