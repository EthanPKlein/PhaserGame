import Phaser from 'phaser'

export default class Space  {
  constructor({ game }) {
    this.image = game.add.image(0, 0, 'space');
   
    this.image.scale.setTo(2, 2);

  }

  update(delta) {
   
  }

}
