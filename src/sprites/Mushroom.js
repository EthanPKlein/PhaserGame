import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor({ game, x, y, asset }) {
    super(game, x, y, asset);
    this.anchor.setTo(0.5);
    this.velocity = {x: 0, y: 0};
  }

  update(delta) {
    this._handleInput(delta);
    this.move();
    this.forceInBounds();
  }

  move() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  forceInBounds() {
    if (this.x > 400 || this.x < 0) {
      this.velocity.x *= -1;
      this.angle += 3;
    }
    if (this.y > 400 || this.y < 0) {
      this.velocity.y *= -1;
      this.angle += 3;
    }
  }

  _handleInput(delta) {

    let cursors = this.game.input.keyboard.createCursorKeys();

    if (cursors.up.isDown) {
      this.velocity.y += -.5;
    }
    if (cursors.down.isDown) {
      this.velocity.y += .5;
    }
    if (cursors.left.isDown) {
      this.velocity.x += -.5;
    }
    if (cursors.right.isDown) {
      this.velocity.x += .5;
    }

  }

}
