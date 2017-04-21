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
    this.load.image('iron_2', 'assets/images/iron_2.png');
    this.load.image('iron_1', 'assets/images/iron_1.png');
    this.load.image('iron_0', 'assets/images/iron_0.png');
    this.load.image('ship_5', 'assets/images/ship_5.png');
    this.load.image('ship_4', 'assets/images/ship_4.png');
    this.load.image('ship_3', 'assets/images/ship_3.png');
    this.load.image('ship_2', 'assets/images/ship_2.png');
    this.load.image('ship_1', 'assets/images/ship_1.png');
    this.load.image('ship_0', 'assets/images/ship_0.png');
    this.load.image('bouncy_0', 'assets/images/bouncy_0.png');
    this.load.image('bouncy_1', 'assets/images/bouncy_1.png');

    this.load.image('ammo', 'assets/images/ammo.png');
    this.load.image('bigAmmo', 'assets/images/ammo_big.png');
    this.load.image('health', 'assets/images/health.png');
    this.load.image('bigHealth', 'assets/images/bighealth.png');
    this.load.image('time', 'assets/images/time.png');
    this.load.image('bigTime', 'assets/images/bigtime.png');
    this.load.image('shield', 'assets/images/shield.png');
    this.load.image('bigShield', 'assets/images/shieldBig.png');

    this.load.image('fireParticle', 'assets/images/fire.png');
    this.load.image('asteroidParticle', 'assets/images/asteroid_particle.png');
    this.load.image('cometParticle', 'assets/images/comet_particle.png');

  }

  create () {
    this.state.start('Game')
  }
}
