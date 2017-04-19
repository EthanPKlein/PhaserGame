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
const STARTING_TIMER = 15000;

export default class extends Phaser.State {
  init() { }

  preload() { 
    game.load.audio('bullet', 'assets/audio/SoundEffects/laser.wav');
    game.load.audio('explosion', 'assets/audio/SoundEffects/explosion.wav');
    game.load.audio('music', 'assets/audio/Music/Corruption.mp3');
    game.load.audio('damage', 'assets/audio/SoundEffects/alarm.wav');
    game.load.audio('noammo', 'assets/audio/SoundEffects/noammo.wav');
    game.load.audio('death', 'assets/audio/SoundEffects/bigboom.wav');
    game.load.audio('victory', 'assets/audio/SoundEffects/chime.wav');
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

    this.player.resetPosition();

    this.fireCooldown = NO_FIRE_COOLDOWN;
    this.playerScore = 0;
    this.waveNumber = 0;
    this.gameTimer = STARTING_TIMER;
    this.inbetweenWave = false;

    this.bullets = [];
    this.asteroids = [];

    this.asteroidsGroup = this.game.add.group();
    

    this.game.add.existing(this.player);

    this.overlay = new Overlay({
      game: this.game,
      player: this.player,
      wave: this.waveNumber
    });

    // Sound
    this.sfxBullet = game.add.audio('bullet');
    this.sfxExplosion = game.add.audio('explosion');
    this.sfxDamage = game.add.audio('damage');
    this.sfxNoAmmo = game.add.audio('noammo');
    this.sfxDeath = game.add.audio('death');
    this.sfxVictory = game.add.audio('victory');
    this.music = game.add.audio('music');
    this.music.loopFull(1);

  }

  update() {

    this.game.physics.arcade.collide(this.asteroidsGroup);

    this.overlay.update(this.waveNumber, this.gameTimer, this.inbetweenWave);

    this.fireCooldown -= this.getDelta();

    if (this.player.isAlive() && !this.inbetweenWave) {
      this.gameTimer -= this.getDelta();
    }

    // if game time is out, destroy player
    if (this.player.isAlive() && this.gameTimer <= 0) {
      this.player.changeHealth(-999);
      this.endGame();
    }

    this.space.update();

    // damage player if they are hitting an asteroid
    if (!this.player.isInvulnerable() && this.player.isCollidingWithAnyInArray(this.asteroids) && this.player.isAlive() > 0) {
      this.player.changeHealth(-1);
      if (!this.player.isAlive()) {
        this.endGame();
      } else if (this.player.isAlive()){
        this.sfxDamage.play();
        this.player.setInvulnerable(INVULNERABLE_AFTER_DAMAGE_COOLDOWN);
      }

    }

    // clean up old bullets
    for (var i = 0; i < this.bullets.length; i++) {
      var b = this.bullets[i];
      var destroyBullet = false;
      b.update();

      for (var j = 0; j < this.asteroids.length; j++) {
        var asteroid = this.asteroids[j];
        if (b.isCollidingWithEntity(asteroid)) {
          this.asteroids.splice(j, 1);
          asteroid.destroy();
          destroyBullet = true;
          this.sfxExplosion.play();
          this.player.score += 100;
        }
      }

      if (b.isOutOfBounds() || destroyBullet) {
        this.bullets.splice(i, 1);
        b.destroy();
      }
    }

    if (this.waveComplete()) {
      this.game.time.events.add(3000, function() {
        this.startWave();
      }, this);
      
    }

  }

  spawnAsteroids(count) {
    for (var i = 0; i < count; i++) {
      var asteroid = new Asteroid({
        game: this,
        x: Math.random()*this.world.width,
        y: Math.random()*this.world.height,
        asset: 'asteroid'
      });
      this.asteroidsGroup.add(asteroid);
      
      this.asteroids.push(asteroid);
    }

    this.asteroidsGroup.enableBody = true;
    this.asteroidsGroup.physicsBodyType = Phaser.Physics.ARCADE;
    this.asteroidsGroup.setAll('body.collideWorldBounds', true);
    this.asteroidsGroup.setAll('body.bounce.x', 1);
    this.asteroidsGroup.setAll('body.bounce.y', 1);

  }

  addBullets() {

    if (this.fireCooldown > 0) {
      return;
    } else if (this.player.bullets <= 0) {
      this.sfxNoAmmo.play();
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

  waveComplete() {
    if (this.inbetweenWave === false && this.asteroidsGroup.countLiving() === 0) {
      this.inbetweenWave = true;
      return true;
    }
    return false;
  }

  startWave(wave) {
    this.inbetweenWave = false;
    if (this.waveNumber > 0) {
      this.sfxVictory.play();
    }
    this.waveNumber++;
    this.gameTimer = 20000 + 10000*(this.waveNumber-1);
    this.player.resetPosition();
    this.player.setInvulnerable(INVULNERABLE_AFTER_DAMAGE_COOLDOWN*2);;
    this.player.giveBullets(10+(this.waveNumber-1)*3);
    this.spawnAsteroids(this.waveNumber * 7);
  }

  endGame() {
    this.player.destroy();
    this.sfxDeath.play();
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
