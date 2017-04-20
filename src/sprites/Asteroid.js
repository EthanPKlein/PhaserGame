import Phaser from 'phaser'

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

    if (type === 'asteroid') {
      this.hp = 1;
    } else if (type === 'comet') {
      this.hp = 2;
    }

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
    this.body.velocity.x = 2*Math.random()-1;
    this.body.velocity.y = 2*Math.random()-1;
      this.angle = Math.random()*360;
      this.body.x = Math.random()*this.game.world.width;
      this.body.y = Math.random()*this.game.world.height;
      this.rotVelocity = Math.random()*2-1;
  }

  damage(amount) {
    this.hp -= amount;
    this.redraw();
  }

  redraw() {
    if (this.type === 'comet') {
      if (this.hp === 2) {
        this.loadTexture('comet_1');
      } else if (this.hp <= 1) {
        this.loadTexture('comet_0');
      }
    }
    else if (this.type === 'asteroid') {
      this.loadTexture('asteroid');
    }
  }

}
