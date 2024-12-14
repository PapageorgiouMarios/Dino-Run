export default class Ground
{
    constructor(ctx, width, height, speed, scaleRatio)
    {
        this.ctx = ctx;
        this.canvas = this.ctx.canvas;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.scaleRatio = scaleRatio;

        this.x = 0;
        this.y = this.canvas.height - this.height;

        this.image = new Image();
        this.image.src = 'assets/Ground.png';
    }

    draw()
    {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);

        if(this.x < -this.width)
        {
            this.x = 0;
        }
    }

    update(gameSpeed, frameGap)
    {
        this.x -= gameSpeed * frameGap * this.speed * this.scaleRatio;
    }

    reset(){ this.x = 0; }
}