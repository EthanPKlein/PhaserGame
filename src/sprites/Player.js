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
      this.angle += 3;
    }
    if (this.y > this.game.world.height || this.y < 0) {
      this.velocity.y *= -1;
      this.angle += 3;
    }
  }

  fire() {
    this.game.addBullets();
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

    if (wasd.up.isDown) {
      this.velocity.y += -.5;
    }
    if (wasd.down.isDown) {
      this.velocity.y += .5;
    }
    if (wasd.right.isDown) {
      this.velocity.x += .5;
    }
    if (wasd.left.isDown) {
      this.velocity.x += -.5;
    }
    if (wasd.rotRight.isDown) {
      //this.angle += 2;
    }
    if (wasd.rotLeft.isDown) {
      //this.angle += -2;
    }
    if (wasd.lshift.isDown) {
      this.decelerate();
    }
    if (wasd.space.isDown) {
      this.fire();
    }

  }

}