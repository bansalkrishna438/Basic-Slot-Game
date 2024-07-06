
import * as PIXI from 'pixi.js'
import { Loader } from '@pixi/loaders';

// Constants for reel configuration
const SYMBOL_SIZE = 80; // Size of each symbol
const REEL_WIDTH = SYMBOL_SIZE * 2; // Width of the reel (we assume square symbols)
const REEL_HEIGHT = SYMBOL_SIZE /2; // Height of the reel (3 symbols visible)
const NUM_SYMBOLS = 5; // Number of symbols per reel

// create a pixi application 

const app = new PIXI.Application({
    width:window.innerWidth,
    height:window.innerHeight,
    background:0xfff000
});
document.body.appendChild(app.view)

let isSpinning = false;

// create  a style for Pixi text

const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'], // Gradient fill
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
    lineHeight: 50,
    align: 'center',
});

//create a slot machine Text

const slotMachine = new PIXI.Text("Slot Machine",style)
slotMachine.x= app.screen.width/2.4,
slotMachine.y=20,
app.stage.addChild(slotMachine);

// create  a reel container of container type
const reelContainer = new PIXI.Container();
app.stage.addChild(reelContainer);

// create a texture for reel Bg

const texture =PIXI.Texture.from('./assests/img/300px/symbolBack.png');
const bgImage = new PIXI.Sprite(texture);
bgImage.x =280;
bgImage.y =100;
bgImage.width=800;
bgImage.height =400;
reelContainer.addChild(bgImage);

const bgBorder = new PIXI.Sprite(PIXI.Texture.from('./assests/img/300px/columns.png'));
bgBorder.x =275;
bgBorder.y =91;
bgBorder.width=810;
bgBorder.height =409;
bgBorder.zIndex=99;
app.stage.addChild(bgBorder);

const reelGridMask = new PIXI.Graphics();
reelGridMask.beginFill('#000000');
reelGridMask.drawRect(0,0,reelContainer.width *2,reelContainer.height +92);
reelGridMask.endFill();
// reelGridMask.position.set(50,50)
reelContainer.mask = reelGridMask;
reelContainer.addChild(reelGridMask);


// create a reel spin Button

const spinButton = new PIXI.Graphics();
spinButton.beginFill('#000000');
spinButton.drawRoundedRect(1000,520,70,40);
spinButton.endFill();
spinButton.eventMode ='static';
spinButton.cursor = 'pointer';
spinButton.on('pointerdown',()=>{
    console.log('button clicked!');
    if(!isSpinning){
    setRandomSymbols(); // Set random symbols before spinning (replace with your logic)
    spinReels(); // Spin the reels
    }
})
app.stage.addChild(spinButton);

// create a button to stop Spin

const stopButton = new PIXI.Graphics();
stopButton.beginFill('#000000');
stopButton.drawRoundedRect(900,520,70,40);
stopButton.endFill();
stopButton.eventMode ='static';
stopButton.cursor = 'pointer';
stopButton.on('pointerdown',()=>{
    console.log('button clicked!');
    isSpinning = false
})
app.stage.addChild(stopButton);

// create a text on spin button

const spinText = new PIXI.Text('Spin',style)
spinText.x = 1005
spinText.y = 515
spinText.width = 60
spinText.height =50
spinButton.addChild(spinText)

// create a text on stop button

const stopText = new PIXI.Text('Stop',style)
stopText.x = 905
stopText.y = 515
stopText.width = 60
stopText.height =50
stopButton.addChild(stopText)


const reels = [];
let gameSymbol = ['./assests/img/300px/cherry.png','./assests/img/300px/diamond.png','./assests/img/300px/grape.png','./assests/img/300px/lemon.png','./assests/img/300px/watermelon.png'];

// Create reels and symbols
for (let i = 0; i < 5; i++) {
    let reel = new PIXI.Container();
    reel.x = i * REEL_WIDTH + 300 + i *10;
    reel.y = 100; // Adjust vertical position as needed

    let symbols = [];

    // Add symbols to the reel
    for (let j = 0; j < NUM_SYMBOLS; j++) {
        let symbol = new PIXI.Sprite(PIXI.Texture.from(gameSymbol[Math.floor(Math.random()* gameSymbol.length)])); // Replace with actual symbol texture
        symbol.width = SYMBOL_SIZE;
        symbol.height = SYMBOL_SIZE;
        symbol.y = j * SYMBOL_SIZE;
        reel.addChild(symbol);
        symbols.push(symbol);
    }
    reels.push(reel);
    reelContainer.addChild(reel);
}
function spinReels() {
    const spinDuration = 2000; // Duration of the spin animation in milliseconds
    const targetSymbolIndexes = [1, 1, 1, 1, 1]; // Example target symbol indexes for each reel

    let startTime = Date.now();

    // Define the update function
    function update() {
        let elapsedTime = Date.now() - startTime;
        let progress = Math.min(elapsedTime / spinDuration, 1); // Progress from 0 to 1

        // Update each reel's symbols position based on progress
        for (let i = 0; i < reels.length; i++) {
            let reel = reels[i];
            let targetIndex = targetSymbolIndexes[i];
            reel.y = SYMBOL_SIZE *  progress + 100;
        }

        // Check if animation is complete
        if (progress < 1 && isSpinning) {
            requestAnimationFrame(update); // Continue animation
        } else {
            // Snap reels to exact positions
            for (let reel of reels) {
                reel.y = SYMBOL_SIZE * targetSymbolIndexes[reels.indexOf(reel)] + 20 ;
            }
            console.log('Animation complete!');
            isSpinning = false;
        }
    }
    isSpinning = true;
    // Start the animation
    update();
}
function setRandomSymbols() {
    for (let reel of reels) {
        console.log(reel.children);
        let i = 0 ;
        for (let symbol of reel.children) {
            console.log(symbol);
            // Replace with your logic to set random symbols
            symbol.texture = PIXI.Texture.from(gameSymbol[Math.floor(Math.random()* gameSymbol.length)]); 
            i++;// Replace with actual symbol texture
        }
    }
}

