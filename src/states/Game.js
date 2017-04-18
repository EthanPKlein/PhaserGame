/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import Asteroid from '../sprites/Asteroid'
import Space from '../environment/Space'
import Bullet from '../sprites/Bullet'
import Overlay from '../UI/overlay'

const ASTEROID_COUNT = 25;
const NO_FIRE_COOLDOWN = 400;
const INVULNERABLE_AFTER_DAMAGE_COOLDOWN = 2000;
const STARTING_BULLETS = 100;

export default class extends Phaser.State {
  init() { }

  preload() { 
    game.load.audio('bullet', 'assets/audio/SoundEffects/laser.wav');
    game.load.audio('explosion', 'assets/audio/SoundEffects/explosion.wav');
    game.load.audio('music', 'assets/audio/Music/Corruption.mp3');
  }

  create() {

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.space = new Space(this);

    this.player = new Player({
      game: this,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'ship'
    });

    this.fireCooldown = NO_FIRE_COOLDOWN;
    this.playerScore = 0;

    this.bullets = [];
    this.asteroids = [];

    this.asteroidsGroup = this.game.add.group();
    this.asteroidsGroup.enableBody = true;
    this.asteroidsGroup.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < ASTEROID_COUNT; i++) {
      var asteroid = new Asteroid({
        game: this,
        x: Math.random()*this.world.width,
        y: Math.random()*this.world.height,
        asset: 'asteroid'
      });
      this.asteroidsGroup.add(asteroid);
      
      this.asteroids.push(asteroid);
    }

    this.asteroidsGroup.setAll('body.collideWorldBounds', true);
    this.asteroidsGroup.setAll('body.bounce.x', 1);
    this.asteroidsGroup.setAll('body.bounce.y', 1);

    this.game.add.existing(this.player);

    this.overlay = new Overlay({
      game: this.game,
      player: this.player
    });

    // Sound
    this.sfxBullet = game.add.audio('bullet');
    this.sfxExplosion = game.add.audio('explosion');
    this.music = game.add.audio('music');
    this.music.loopFull(1);

  }

  update() {

    this.game.physics.arcade.collide(this.asteroidsGroup);

    this.overlay.update();

    this.fireCooldown -= this.getDelta();
    this.space.update();

    // damage player if they are hitting an asteroid
    if (!this.player.isInvulnerable() && this.player.isCollidingWithAnyInArray(this.asteroids)) {
      this.player.changeHealth(-1);
      if (this.player.health <= 0) {
        this.player.destroy();
      } else {
        this.player.setInvulnerable(INVULNERABLE_AFTER_DAMAGE_COOLDOWN);
      }

    }

    // clean up old bullets
    for (var i = 0; i < this.bullets.length; i++) {
      var b = this.bullets[i];
      b.update();

      for (var j = 0; j < this.asteroids.length; j++) {
        var asteroid = this.asteroids[j];
        if (b.isCollidingWithEntity(asteroid)) {
          this.asteroids.splice(j, 1);
          asteroid.destroy();
          this.sfxExplosion.play();
          this.player.score += 100;
        }
      }

      if (b.isOutOfBounds()) {
        this.bullets.splice(i, 1);
        b.destroy();
      }
    }
  }

  addBullets() {

    if (this.fireCooldown > 0 || this.player.bullets <= 0) {
      return;
    } else {
      this.fireCooldown = NO_FIRE_COOLDOWN;
      this.player.useBullet();
      this.sfxBullet.play();
    }

    for (var i = 0; i < 4; i++) {
      var bullet1 = new Bullet({
        game: this,
        x: this.player.x,
        y: this.player.y,
        asset: 'bullet'
      });

      if (i===0) {
        bullet1.velocity.x = .3;
      } else if (i===1) {
        bullet1.velocity.x = -.3;
      } else if (i===2) {
        bullet1.velocity.y = .3;
      } else {
        bullet1.velocity.y = -.3;
      }
      
      this.bullets.push(bullet1);
      this.game.add.existing(bullet1);
    }
  }

  render() {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }

  getDelta() {
    return this.time.now - this.time.prevTime;
  }
}
