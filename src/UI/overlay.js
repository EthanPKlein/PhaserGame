export default class {
    constructor({ game, player, score, wave }) {
        this.game = game;
        this.player = player;
        this.score = score;
        this.currentWave = wave;

        var style = { font: "20px Arial", fill: "#ffffff", align: "center" };
        this.healthText = this.game.add.text(15, 15, "Health: " + this.player.health, style);
        this.bulletsText = this.game.add.text(200, 15, "Health: " + this.player.bullets, style);
        this.scoreText = this.game.add.text(375, 15, "Score: " + this.player.score, style);
        this.currentWaveText = this.game.add.text(550, 15, "Wave: " + this.currentWave, style);
    }

    update(waveNumber) {
        this.healthText.setText("Health: " + this.player.health);
        this.bulletsText.setText("Ammo: " + this.player.bullets);
        this.scoreText.setText("Score: " + this.player.score);
        this.currentWaveText.setText("Wave: " + waveNumber);
    }
}