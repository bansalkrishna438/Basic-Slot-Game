// Create a Pixi Application
const app = new PIXI.Application({ width: 400, height: 400 });
document.body.appendChild(app.view);

// Constants for reel configuration
const SYMBOL_SIZE = 100; // Size of each symbol
const REEL_WIDTH = SYMBOL_SIZE; // Width of the reel (we assume square symbols)
const REEL_HEIGHT = SYMBOL_SIZE * 3; // Height of the reel (3 symbols visible)
const NUM_SYMBOLS = 5; // Number of symbols per reel

// Container to hold symbols for each reel
const reels = [];

// Create a mask shape
const maskShape = new PIXI.Graphics();
maskShape.beginFill(0x000000); // Black color for mask
maskShape.drawRect(0, 0, REEL_WIDTH, REEL_HEIGHT); // Rectangle covering the entire reel grid
maskShape.endFill();
maskShape.position.set(50, 50); // Adjust position as needed

// Create reels and symbols
for (let i = 0; i < 3; i++) {
    let reel = new PIXI.Container();
    reel.x = i * REEL_WIDTH;
    reel.y = 50; // Adjust vertical position as needed

    let symbols = [];

    // Add symbols to the reel
    for (let j = 0; j < NUM_SYMBOLS; j++) {
        let symbol = new PIXI.Sprite(PIXI.Texture.WHITE); // Replace with actual symbol texture
        symbol.width = SYMBOL_SIZE;
        symbol.height = SYMBOL_SIZE;
        symbol.y = j * SYMBOL_SIZE;
        reel.addChild(symbol);
        symbols.push(symbol);
    }

    reel.mask = maskShape; // Apply mask to reel container
    reels.push({ container: reel, symbols: symbols });
    app.stage.addChild(reel);
}

// Add mask shape to stage
app.stage.addChild(maskShape);

// Function to set random symbols on the reel grid
function setRandomSymbols() {
    for (let reel of reels) {
        let randomIndex = Math.floor(Math.random() * NUM_SYMBOLS);
        let symbol = reel.symbols[randomIndex];
        symbol.texture = PIXI.Texture.WHITE; // Replace with actual random symbol texture
    }
}

// Function to spin the reels
function spinReels() {
    const spinDuration = 3000; // Duration of the spin animation in milliseconds
    const targetSymbolIndexes = [2, 4, 1]; // Example target symbol indexes for each reel

    let startTime = Date.now();

    // Disable spin button during spin
    spinButton.disabled = true;

    // Define the update function
    function update() {
        let elapsedTime = Date.now() - startTime;
        let progress = Math.min(elapsedTime / spinDuration, 1); // Progress from 0 to 1

        // Update each reel's symbols position based on progress
        for (let i = 0; i < reels.length; i++) {
            let reel = reels[i].container;
            let targetIndex = targetSymbolIndexes[i];
            reel.y = -SYMBOL_SIZE * targetIndex * progress;

            // Add a random symbol when reaching the end
            if (progress >= 1 && reel.y === -SYMBOL_SIZE * targetIndex) {
                let randomIndex = Math.floor(Math.random() * NUM_SYMBOLS);
                let symbol = reel.symbols[randomIndex];
                symbol.texture = PIXI.Texture.WHITE; // Replace with actual random symbol texture
            }
        }

        // Check if animation is complete
        if (progress < 1) {
            requestAnimationFrame(update); // Continue animation
        } else {
            // Snap reels to exact positions
            for (let reel of reels) {
                reel.container.y = -SYMBOL_SIZE * targetSymbolIndexes[reels.indexOf(reel)];
            }
            console.log('Animation complete!');
            spinButton.disabled = false; // Enable spin button after animation
        }
    }

    // Start the animation
    update();
}

// Button to trigger the spin
const spinButton = document.createElement('button');
spinButton.textContent = 'Spin';
spinButton.style.position = 'absolute';
spinButton.style.top = '10px';
spinButton.style.left = '10px';
document.body.appendChild(spinButton);

// Event listener for spin button click
spinButton.addEventListener('click', () => {
    setRandomSymbols(); // Set random symbols before spinning
    spinReels(); // Spin the reels
});
