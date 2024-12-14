// The CactusController handles the spawn of diffrent cacti while the user plays
import Cactus from "./Cactus.js";

export default class CactusController 
{
    CACTUS_INTERVAL_MIN = 500;
    CACTUS_INTERVAL_MAX = 2000;

    next_cactus_interval = null;
    cacti = [];

    constructor(ctx, cactiImages, scaleRatio, speed)
    {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.cactiImages = cactiImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;

        this.GenerateNextCactusTime();
    }

    GenerateNextCactusTime()
    {
        const random_number = this.getRandomNumber(this.CACTUS_INTERVAL_MIN, this.CACTUS_INTERVAL_MAX);
        this.next_cactus_interval = random_number;
    }

    getRandomNumber(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    createCactus()
    {
        const index = this.getRandomNumber(0, this.cactiImages.length - 1);
        const cactus_image = this.cactiImages[index];
        const x = this.canvas.width * 1.5;
        const y = this.canvas.height - cactus_image.height;

        const cactus = new Cactus(this.ctx, x, y, cactus_image.width, cactus_image.height, cactus_image.image)
        this.cacti.push(cactus);
    }

    update(gameSpeed, frameGap) 
    {
        if (this.next_cactus_interval <= 0)
        {
            this.createCactus();
            this.GenerateNextCactusTime();
        }
        this.next_cactus_interval -= frameGap;

        this.cacti.forEach
        (
            (cactus)=>
            {
                cactus.update(this.speed, gameSpeed, frameGap, this.scaleRatio);
            }
        );

        this.cacti = this.cacti.filter((cactus) => cactus.x > -cactus.width);
    }

    draw() 
    {
        this.cacti.forEach((cactus)=>{cactus.draw();});
    }

    collidesWith(sprite)
    {
        return this.cacti.some((cactus)=> cactus.collidesWith(sprite));
    }

    reset(){ this.cacti = []; }
}