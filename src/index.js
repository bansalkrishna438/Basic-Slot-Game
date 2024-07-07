import * as PIXI from 'pixi.js'
import gsap from 'gsap';

// Constants for reel configuration
const SYMBOL_SIZE = 80;
const REEL_WIDTH = SYMBOL_SIZE * 2;
const NUM_SYMBOLS = 5;

// create a pixi application 
let spinTimeOut;
let isSpinning = false;
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    background: 0xfff000
});
document.body.appendChild(app.view)

// create a style for Pixi text
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
const slotMachine = new PIXI.Text("Slot Machine", style)
slotMachine.x = app.screen.width / 2.4;
slotMachine.y = 20;
app.stage.addChild(slotMachine);

// create a reel container of container type
const reelContainer = new PIXI.Container();
app.stage.addChild(reelContainer);

// create a texture for reel Bg
const texture = PIXI.Texture.from('./assests/img/300px/symbolBack.png');
const bgImage = new PIXI.Sprite(texture);
bgImage.x = 280;
bgImage.y = 100;
bgImage.width = 800;
bgImage.height = 400;
reelContainer.addChild(bgImage);

const bgBorder = new PIXI.Sprite(PIXI.Texture.from('./assests/img/300px/columns.png'));
bgBorder.x = 275;
bgBorder.y = 91;
bgBorder.width = 810;
bgBorder.height = 409;
bgBorder.zIndex = 99;
app.stage.addChild(bgBorder);

const reelGridMask = new PIXI.Graphics();
reelGridMask.beginFill('#000000');
reelGridMask.drawRect(0, 0, reelContainer.width * 2, reelContainer.height + 92);
reelGridMask.endFill();
reelContainer.mask = reelGridMask;
reelContainer.addChild(reelGridMask);


// create a reel spin Button
const spinButton = new PIXI.Graphics();
spinButton.beginFill('#000000');
spinButton.drawRoundedRect(1000, 520, 70, 40);
spinButton.endFill();
spinButton.eventMode = 'static';
spinButton.cursor = 'pointer';
spinButton.on('pointerdown', () => {
    if (!isSpinning) {
        setRandomSymbols(); // Set random symbols before spinning (replace with your logic)
        spinReels(); // Spin the reels
        app.ticker.start();
    }
});
app.stage.addChild(spinButton);

// create a button to stop Spin
const stopButton = new PIXI.Graphics();
stopButton.beginFill('#000000');
stopButton.drawRoundedRect(900, 520, 70, 40);
stopButton.endFill();
stopButton.eventMode = 'static';
stopButton.cursor = 'pointer';
stopButton.on('pointerdown', () => {
    const winText = reelContainer.getChildByName("winningText");
    if (winText) {
        reelContainer.removeChild(winText);
    }
    isSpinning = false;
    app.ticker.stop();
    clearTimeout(spinTimeOut);
    spinButton.eventMode = 'static';
    stopReels();

});
app.stage.addChild(stopButton);

// create a text on spin button
const spinText = new PIXI.Text('Spin', style);
spinText.x = 1005;
spinText.y = 515;
spinText.width = 60;
spinText.height = 50;
spinButton.addChild(spinText);

// create a text on stop button
const stopText = new PIXI.Text('Stop', style);
stopText.x = 905;
stopText.y = 515;
stopText.width = 60;
stopText.height = 50;
stopButton.addChild(stopText);

const reels = [];
let gameSymbol = ['./assests/img/300px/cherry.png', './assests/img/300px/diamond.png', './assests/img/300px/grape.png', './assests/img/300px/lemon.png', './assests/img/300px/watermelon.png'];

// Create reels and symbols
for (let i = 0; i < 5; i++) {
    let reel = new PIXI.Container();
    reel.x = i * REEL_WIDTH + 300 + i * 10;
    reel.y = 100; // Adjust vertical position as needed

    let symbols = [];

    // Add symbols to the reel
    for (let j = 0; j < NUM_SYMBOLS; j++) {
        let symbol = new PIXI.Sprite(PIXI.Texture.from(gameSymbol[Math.floor(Math.random() * gameSymbol.length)])); // Replace with actual symbol texture
        symbol.width = SYMBOL_SIZE;
        symbol.height = SYMBOL_SIZE;
        symbol.y = j * SYMBOL_SIZE + 35;
        symbol.anchor.set(0.5); // Set anchor point to the center
        symbol.x = SYMBOL_SIZE / 2; // Adjust x position to account for anchor point
        reel.addChild(symbol);
        symbols.push(symbol);
    }
    reels.push(reel);
    reelContainer.addChild(reel);
}

function spinReels() {
    const spinDuration = 2000; // Duration of the spin animation in milliseconds
    spinButton.eventMode = 'passive';
    isSpinning = true;
    // Start the animation
    app.ticker.add(updateSymbols);
    spinTimeOut = setTimeout(stopReels, spinDuration);
}

function updateSymbols() {
    for (let reel of reels) {
        for (let symbol of reel.children) {
            symbol.texture = PIXI.Texture.from(gameSymbol[Math.floor(Math.random() * gameSymbol.length)]);
        }
    }
}

function stopReels() {
    // Stop the animation loop and spinning flag
    app.ticker.remove(updateSymbols);
    isSpinning = false;
    spinButton.eventMode = 'static';
    clearTimeout(spinTimeOut);
    checkForWin();
}

function setRandomSymbols() {
    for (let reel of reels) {
        let i = 0;
        for (let symbol of reel.children) {
            symbol.texture = PIXI.Texture.from(gameSymbol[Math.floor(Math.random() * gameSymbol.length)]);
            i++;
        }
    }
}

function checkForWin() {
    // Get symbols from the first three reels
    const symbolsInReels = [];
    for (let i = 0; i < 3; i++) {
        symbolsInReels.push(reels[i].children[Math.floor(NUM_SYMBOLS / 2)]); // Get the middle symbol of each reel
    }

    // Check if all middle symbols are the same
    if (symbolsInReels.every((symbol, index, array) => symbol.texture.baseTexture === array[0].texture.baseTexture)) {
        // Animate winning symbols
        symbolsInReels.forEach(symbol => {
            gsap.to(symbol, {
                rotation: 360,
                duration: 2,
                ease: 'power1.inOut',
                onComplete: () => {
                    gsap.to(symbol, { rotation: 0, duration: 0 }); // Reset rotation
                }
            });
        });

        // Show a popup or some visual indication of winning
        showWinPopup('You Win!');
    } else {
        showWinPopup('No win this time!');
    }
}

function showWinPopup(message) {
    // Example: Create a PIXI Text object for the popup message
    const winText = new PIXI.Text(message, {
        fontSize: 36,
        fill: 'yellow',
        stroke: '#000000',
        strokeThickness: 4,
    });
    winText.name = 'winningText';
    winText.x = app.screen.width / 2 - winText.width / 2;
    winText.y = app.screen.height / 2 - winText.height / 2;
    reelContainer.addChild(winText);
    winText.visible = true;
    reelContainer.sortableChildren = true;
    winText.zIndex = 99;

    // Example: Tween animation to fade out and remove the popup after a delay
    gsap.to(winText, { alpha: 0, duration: 2, onComplete: () => reelContainer.removeChild(winText) });
}