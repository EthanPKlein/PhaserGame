import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('ship', 'assets/images/ship.png');
    this.load.image('asteroid', 'assets/images/asteroid.png');
    this.load.image('space', 'assets/images/space.png');
    this.load.image('bullet', 'assets/images/bullet.png');
    this.load.image('comet_1', 'assets/images/comet_1.png');
    this.load.image('comet_0', 'assets/images/comet_0.png');
  }

  create () {
    this.state.start('Game')
  }
}
