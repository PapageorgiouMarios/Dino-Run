// The Score class is used to both keep track of the current score
// as well as maintaining a high score in the Local Storage

export default class Score 
{
    score = 0;
    HIGH_SCORE = "highScore"; // Key for storage

    hunder_sound = new Audio("/sounds/plus_hundred.wav");
    lastHundred = 0; // used to make sound everytime the user adds +100 to their score

    constructor(ctx, scaleRatio)
    {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.scaleRatio = scaleRatio;
    }

    update(frameGap)
    {
        this.score += frameGap * 0.01;

        if (Math.floor(this.score / 100) > Math.floor(this.lastHundred / 100)) 
        {
            this.hunder_sound.play(); 
            this.lastHundred = this.score;
        }
    }

    reset()
    {
        this.score = 0;
        this.lastHundred = 0;
    }

    setHighScore()
    {
        const highScore = Number(localStorage.getItem(this.HIGH_SCORE))

        if(this.score > highScore)
            {
                localStorage.setItem(this.HIGH_SCORE, Math.floor(this.score))
            }
    }

    draw()
    {
        const highScore = Number(localStorage.getItem(this.HIGH_SCORE))
        const y = 20 * this.scaleRatio;

        const fontSize = 12 * this.scaleRatio;
        this.ctx.font = `${fontSize}px "MyCustomFont", sans-serif`;
        this.ctx.fillStyle = "black";

        const current_score_x = this.canvas.width - 75 * this.scaleRatio;
        const high_score_x = current_score_x - 125 * this.scaleRatio;

        const score_padded = Math.floor(this.score).toString().padStart(6, 0);
        const high_score_padded = highScore.toString().padStart(6, 0);

        this.ctx.fillText(score_padded, current_score_x, y);
        this.ctx.fillText(`HI ${high_score_padded}`, high_score_x, y);
    }
}