import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor({ game, x, y, asset }) {
    super(game, x, y, asset);
    this.anchor.setTo(0.5, 0.5);
    //this.velocity = {x: 0, y: 0};
    this.rotVelocity = 0;
    this.hp = 3;
    game.physics.arcade.enable(this);
    this.body.setSize(20,20);
    this.randomizeDirection();
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
      //this.body.velocity = {x: 2*Math.random()-1, y: 2*Math.random()-1};
      this.angle = Math.random()*360;
      this.body.x = Math.random()*this.game.world.width;
      this.body.y = Math.random()*this.game.world.height;
      this.rotVelocity = Math.random()*2-1;
  }

}
