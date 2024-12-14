import Player from "./Player.js";
import Ground from "./Ground.js";
import CactusController from "./CactusController.js";
import Score from "./Score.js";
import CloudController from "./CloudController.js";

const canvas = document.getElementById("game"); // Get the index.html canvas
const ctx = canvas.getContext("2d"); // Get the canvas' context

const WIDTH = 800; // Default canvas width
const HEIGHT = 200; // Default canvas height

const SPEED_START = 1; // Game speed when game starts
const SPEED_INCREASE = 0.00002; // The game's speed increases while playing

// Our dinosaur character has it's own image width and height
const PLAYER_WIDTH = 58;
const PLAYER_HEIGHT = 62;

// When the user presses space the dinosaur jumps
// Of course the jump must have its limits 
const MAX_JUMP_HEIGHT = HEIGHT;
const MIN_JUMP_HEIGHT = 150;

// The ground where the dinosaur runs works like an image as well
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 24;

// This is a catalog with all possible cacti images 
const CACTI_CONGIG = 
[
    {width: Math.floor(50/1.5), height: Math.floor(96/1.5), image: "assets/cactus_A_1.png"},
    {width: Math.floor(100/1.5), height: Math.floor(96/1.5), image: "assets/cactus_A_2.png"},
    {width: Math.floor(150/1.5), height: Math.floor(98/1.5), image: "assets/cactus_A_3.png"},

    {width: Math.floor(34/1.5), height: Math.floor(70/1.5), image: "assets/cactus_B_1.png"},
    {width: Math.floor(68/1.5), height: Math.floor(70/1.5), image: "assets/cactus_B_2.png"},
    {width: Math.floor(102/1.5), height: Math.floor(70/1.5), image: "assets/cactus_B_3.png"},
];

const game_over_image = new Image();
game_over_image.src = "assets/Game_Over_Text.png";

const ENVIROMENT_SPEED = 0.5; // Both the ground and cacti have their own movement speed 

let player = null;
let ground = null;
let cactusController = null;
let cloudController = null;

let scaleRatio = null; // Because the game works on multiple devices with different dimensions, 
                       // we need to scale all images' widths and heights 
let passedTime = null;
let gameSpeed = SPEED_START; // Set the starting speed
let game_over = false; // Check if the user (dinosaur) hit an obstacle (cactus)
let event_listener_for_reset = false;

let start = false; // Check if the game started
let score = null; // Keep track of the user's current score

const game_over_audio = new Audio("/sounds/game_over.wav")

function createAnimationSprites()
{
    const currentPlayerWidth = PLAYER_WIDTH * scaleRatio;
    const currentPlayerHeight = PLAYER_HEIGHT * scaleRatio;

    const minJumpHeight = MIN_JUMP_HEIGHT * scaleRatio;
    const maxJumpHeight = MAX_JUMP_HEIGHT * scaleRatio;

    player = new Player(ctx, currentPlayerWidth, currentPlayerHeight, minJumpHeight, maxJumpHeight, scaleRatio);

    const currentGroundWidth = GROUND_WIDTH * scaleRatio;
    const currentGroundHeight = GROUND_HEIGHT * scaleRatio;

    ground = new Ground(ctx, currentGroundWidth, currentGroundHeight, ENVIROMENT_SPEED, scaleRatio);

    const cactiImages = CACTI_CONGIG.map
    (
        cactus =>
            {
                const cactus_image = new Image();
                cactus_image.src = cactus.image;
                return {image: cactus_image, width: cactus.width * scaleRatio, height: cactus.height * scaleRatio,};
            }
    );

    cactusController = new CactusController(ctx, cactiImages, scaleRatio, ENVIROMENT_SPEED);

    cloudController = new CloudController(ctx, canvas.width, canvas.height, scaleRatio);

    score = new Score(ctx, scaleRatio);
}

// Scale Ratio is important so that the game adapts to multiple screen dimensions
// To put it simply: The game runs in a small mobile phone screen and a large computer screen
function getScaleRatio()
{
    const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
    const screenWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

    let ratio = screenWidth/screenHeight

    if(ratio < WIDTH/HEIGHT)
    {
        return screenWidth/WIDTH;
    }
    else
    {
        return screenHeight/HEIGHT;
    }
}

// Before we create our assets, we need to make sure the ratio is set properly depending on the screen
function setScreen()
{
    scaleRatio = getScaleRatio();
    canvas.width = WIDTH * scaleRatio
    canvas.height = HEIGHT * scaleRatio
    createAnimationSprites();
}

function IncreaseSpeed(frameGap)
{
    gameSpeed += frameGap * SPEED_INCREASE;
}

function clearScreen()
{
    ctx.fillStyle = "#ed8d49"; // A light orange like color.
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function Start_Game()
{
    // It would be nice to display diffrent messages depending on the user's device
    const using_phone = navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/Android/i)
    const start_game_message = using_phone ? "Tap screen to start" : "Press Space to start";

    const fontSize = 30 * scaleRatio;
    ctx.font = `${fontSize}px "MyCustomFont", sans-serif`;
    ctx.fillStyle = "black";
    const message_x = canvas.width / 10;
    const message_y = canvas.height / 2;
    ctx.fillText(start_game_message, message_x, message_y)

}

function Game_over()
{
    const imageWidth = game_over_image.width * scaleRatio;
    const imageHeight = game_over_image.height * scaleRatio;

    const centerX = (canvas.width - imageWidth) / 2;
    const centerY = (canvas.height - imageHeight) / 2;

    ctx.drawImage(game_over_image, centerX, centerY, imageWidth, imageHeight);

    const using_phone = navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/Android/i)
    const hint_message = using_phone ? "Tap again to retry" : "Press Space to retry";

    const fontSize = 15 * scaleRatio;
    ctx.font = `${fontSize}px "MyCustomFont", sans-serif`;
    ctx.fillStyle = "black";
    const message_x = centerX;
    const message_y = centerY;
    const verticalOffset = 55 * scaleRatio

    ctx.fillText(hint_message, message_x, message_y + verticalOffset);

    
}

function Game_Reset()
{
    if(!event_listener_for_reset)
    {
        event_listener_for_reset = true;

        setTimeout(
            ()=>{   
                  window.addEventListener("keyup", reset, {once: true})
                  window.addEventListener("touchstart", reset, {once: true})
                }, 1000);
    }
}

function reset()
{
    event_listener_for_reset = false;
    game_over = false;
    start = true;
    ground.reset();
    cactusController.reset();
    cloudController.reset();
    score.reset();
    gameSpeed = SPEED_START;
}

function Game(currentTime)
{
    if(passedTime == null)
    {
        passedTime = currentTime;
        requestAnimationFrame(Game);
        return;
    }
    const frameGap = currentTime - passedTime;
    passedTime = currentTime;
    clearScreen();

    if(!game_over && start)
    {
        ground.update(gameSpeed, frameGap);
        cactusController.update(gameSpeed, frameGap);
        cloudController.update();
        player.update(gameSpeed, frameGap)
        score.update(frameGap);
        IncreaseSpeed(frameGap);
    }

    if(!game_over && cactusController.collidesWith(player))
    {
        game_over = true;
        game_over_audio.play();
        Game_Reset();
        score.setHighScore()
    }

    ground.draw();
    cactusController.draw();
    cloudController.draw();
    player.draw();
    score.draw();

    if(game_over)
    {
        Game_over();
    }

    if(!start)
    {
        Start_Game();
    }

    requestAnimationFrame(Game);
}

setScreen();
window.addEventListener("resize", () => setTimeout(setScreen, 500)); // there is always the possibility the screen size changes
// Either by flipping the phone screen or increase/decrease the window's size

if(screen.orientation)
{
    screen.orientation.addEventListener("change", setScreen);
}

requestAnimationFrame(Game);

window.addEventListener("keyup", reset, {once: true})
window.addEventListener("touchstart", reset, {once: true})