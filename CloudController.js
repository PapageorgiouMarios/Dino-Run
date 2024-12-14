// The CloudController spawns the cloud on the background while the user is running
export default class CloudController 
{
    constructor(ctx, canvasWidth, canvasHeight, scaleRatio) 
    {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.scaleRatio = scaleRatio;

        this.clouds = [];
        this.cloudSpeed = 2;
        this.cloudImage = new Image();
        this.cloudImage.src = "assets/Cloud.png";

        this.createClouds();
    }

    createClouds() 
    {
        for (let i = 0; i < 4; i++) 
            {
                // We pick a random position for each cloud
                this.clouds.push
                (
                    {
                        x: this.canvasWidth + Math.random() * 500,
                        y: Math.random() * (this.canvasHeight / 2),
                        width: (50 + (Math.random() * 30)) * this.scaleRatio,
                        height: (25 + (Math.random() * 10)) * this.scaleRatio,
                    }
                );
        }
    }

    update() 
    {
        // Move the cloud to the left
        // If a cloud is not visible anymore then we redraw it far from the canvas
        // This makes the illusion of infinite random clouds
        for (let i = 0; i < this.clouds.length; i++) {
            this.clouds[i].x -= this.cloudSpeed;

            if (this.clouds[i].x + this.clouds[i].width < 0) {
                this.clouds[i].x = this.canvasWidth + Math.random() * 300; 
                this.clouds[i].y = Math.random() * (this.canvasHeight / 2); 
            }
        }
    }

    draw() 
    {
        for (let i = 0; i < this.clouds.length; i++) {
            this.ctx.drawImage(
                this.cloudImage,
                this.clouds[i].x,
                this.clouds[i].y,
                this.clouds[i].width,
                this.clouds[i].height
            );
        }
    }

    reset() 
    {
        this.clouds = [];
        this.createClouds();
    }
}
