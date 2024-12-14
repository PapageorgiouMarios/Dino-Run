export default class Cactus
{
    constructor(ctx, x, y, width, height, image)
    {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
    }

    update(speed, gameSpeed, frameGap, scale_ratio)
    {
        this.x -= speed * gameSpeed * frameGap * scale_ratio;
    }

    draw()
    {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    collidesWith(sprite)
    {
        const adjustBy = 1.4;

        const collision_condition_1 = (sprite.x < this.x + this.width/adjustBy);
        const collision_condition_2 = (sprite.x + sprite.width/adjustBy > this.x);
        const collision_condition_3 = (sprite.y < this.y + this.height/adjustBy);
        const collision_condition_4 = (sprite.height + sprite.y/adjustBy > this.y);

        if(collision_condition_1 &&
           collision_condition_2 &&
           collision_condition_3 &&
           collision_condition_4
        )
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}