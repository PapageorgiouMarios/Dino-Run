export default class Player
{
    RUN_ANIMATION_TIMER = 200;
    current_run_animation_timer = this.RUN_ANIMATION_TIMER;

    // All the players animations are represented by images
    run_images = [];
    jump_images = [];

    jump_button_pressed = false; // The user pressed Space or taps the screen
    jumping = false; // Check if the dinosaur is in the air
    falling = false; // Check if the dinosaur starts falling
    JUMP_SPEED = 0.6;
    GRAVITY = 0.4;

    jump_sound = new Audio('/sounds/jump.wav');

    constructor(context, width, height, min_jump_height, max_jump_height, scale_ratio)
    {
        this.context = context;
        this.canvas = this.context.canvas;
        this.width = width;
        this.height = height;
        this.min_jump_height = min_jump_height;
        this.max_jump_height = max_jump_height;
        this.scale_ratio = scale_ratio;

        this.x = 10 * scale_ratio;
        this.y = this.canvas.height - this.height - 1.5 * scale_ratio;
        this.current_y = this.y;

        this.Idle_Image = new Image();
        this.Idle_Image.src = 'assets/Idle.png';
        this.image = this.Idle_Image;

        const Run_Image_1 = new Image();
        Run_Image_1.src = 'assets/Run_1.png';

        const Run_Image_2 = new Image();
        Run_Image_2.src = 'assets/Run_2.png';

        const Jumping_Image = new Image();
        Jumping_Image.src = 'assets/Jump.png'

        this.run_images.push(Run_Image_1);
        this.run_images.push(Run_Image_2);

        this.jump_images.push(Jumping_Image);

        // All possible events
        // 1) Either the user presses the Space key or
        // 2) The user taps the phone/tablet screen

        window.removeEventListener('keydown', this.keydown);
        window.removeEventListener('keyup', this.keyup);

        window.addEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);

        window.removeEventListener('touchstart', this.touchstart);
        window.removeEventListener('touchend', this.touchend);

        window.addEventListener('touchstart', this.touchstart);
        window.addEventListener('touchend', this.touchend);
        
    }

    touchstart = ()=>{ this.jump_button_pressed = true; }

        touchend = ()=>{ this.jump_button_pressed = false; }

        keydown = (event) => 
        {
            if(event.code === "Space")
            {
                this.jump_button_pressed = true;
            }
        }

        keyup = (event) => 
            {
                if(event.code === "Space")
                {
                    this.jump_button_pressed = false;
                }
            }

    draw() 
    {
        this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    update(gameSpeed, frameGap)
    {
        this.run(gameSpeed, frameGap);

        if(this.jumping)
        {
            this.image = this.jump_images[0];
        }

        this.jump(frameGap);
    }

    run(gameSpeed, frameGap)
    {
        if(this.current_run_animation_timer <= 0)
        {
            if(this.image === this.run_images[0])
            {
                this.image = this.run_images[1];
            }
            else
            {
                this.image = this.run_images[0];
            }
            this.current_run_animation_timer = this.RUN_ANIMATION_TIMER;
        }
        this.current_run_animation_timer -= frameGap * gameSpeed;
    }

    jump(frameGap)
    {
        if(this.jump_button_pressed)
        {
            if(!this.jumping)
            {
                this.jump_sound.play();
            }

            this.jumping = true;
        }

        if(this.jumping && !this.falling)
        {
            if(this.y > this.canvas.height - this.min_jump_height ||
               (this.y > this.canvas.height - this.max_jump_height && this.jump_button_pressed))
            {
                this.y -= this.JUMP_SPEED * frameGap * this.scale_ratio;
            }
            else
            {
                this.falling = true;
            }
        }
        else
        {
            if(this.y < this.current_y)
            {
                this.y += this.GRAVITY * frameGap * this.scale_ratio;

                if(this.y + this.height > this.canvas.height)
                {
                    this.y = this.current_y;
                }
            }
            else
            {
                this.falling = false;
                this.jumping = false;
            }
        }
    }
}