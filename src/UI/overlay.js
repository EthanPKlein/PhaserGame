export default class {
    constructor({ game, player, score, wave }) {
        this.game = game;
        this.player = player;
        this.score = score;
        this.currentWave = wave;

        var style = { font: "20px Arial", fill: "#ffffff", align: "center" };
        var deathText = { font: "80px Arial", fill: "#ff0000", align: "center" };

        this.healthText = this.game.add.text(15, 15, "Health: " + this.player.health, style);
        this.bulletsText = this.game.add.text(200, 15, "Health: " + this.player.bullets, style);
        this.scoreText = this.game.add.text(375, 15, "Score: " + this.player.score, style);
        this.currentWaveText = this.game.add.text(550, 15, "Wave: " + this.currentWave, style);
        this.gameTimerText = this.game.add.text(15, 580, "Time: ", style);
        this.youDiedText = this.game.add.text(200, this.game.world.centerY-40, "", deathText);
    }

    update(waveNumber, gameTimer) {
        this.healthText.setText("Health: " + this.player.health);
        this.bulletsText.setText("Ammo: " + this.player.bullets);
        this.scoreText.setText("Score: " + this.player.score);
        this.currentWaveText.setText("Wave: " + waveNumber);

        var timer = Math.floor(gameTimer / 1000);
        if (timer < 0) {
            timer = 0;
        }

        this.gameTimerText.setText("Time left: " +  timer);
        if (this.player.health <= 0) {
            this.youDiedText.setText("YOU DIED");
        }
        if (timer === 0) {
            this.youDiedText.setText("OUT OF TIME");
        }
    }
}