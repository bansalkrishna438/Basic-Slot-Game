
import * as PIXI from 'pixi.js'
import { Loader } from '@pixi/loaders';

const app = new PIXI.Application({
    width:window.innerWidth,
    height:window.innerHeight,
    background:0xfff000
});
document.body.appendChild(app.view)
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
const slotMachine = new PIXI.Text("Slot Machine",style)
slotMachine.x= app.screen.width/2.4,
slotMachine.y=20,
app.stage.addChild(slotMachine);

const reelContainer = new PIXI.Container();
app.stage.addChild(reelContainer);

const reelGrid = new PIXI.Graphics();
reelGrid.lineStyle(2, 0xFF0000);
reelGrid.beginFill('#ffffff');
reelGrid.drawRect(280,100,800,400);
reelGrid.endFill();
reelContainer.addChild(reelGrid);

const spinButton = new PIXI.Graphics();
spinButton.beginFill('#000000');
spinButton.drawRoundedRect(1000,520,70,40);
spinButton.endFill();
spinButton.eventMode ='static';
spinButton.cursor = 'pointer';
spinButton.on('pointerdown',()=>{
    console.log('button clicked!');
})
app.stage.addChild(spinButton);

const loaders = new Loader();

loaders
.add('symbol1', './assests/img/300px/cherry.png')
.add('symbol2', './assests/img/300px/lemon.png')
.add('symbol3', './assests/img/300px/grape.png')
.add('symbol4', './assests/img/300px/watermelon.png')
.add('symbol5', './assests/img/300px/goldBars.png')
.add('symbol6', './assests/img/300px/diamond.png') 
.add('symbol7', './assests/img/300px/wild.png')
.add('back', './assests/img/300px/symbolBack.png')
.add('columns', './assests/img/300px/columns.png')
.add('spinBttn', './assests/img/300px/.png')
.add('plus', './assests/img/300px/plus.png')
.add('minus', './assests/img/300px/minus.png')
.add('satchel', './assests/img/300px/satchel.png')

loaders.load((loaders,resources)=>{
    console.log('assests load');
})


// const texture = new PIXI.Texture(symbols)

