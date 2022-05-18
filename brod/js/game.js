import mainScene from "./scenes/mainScene.js"
const config = {
    type: Phaser.AUTO,
    widht: 800,
    height: 600,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false,
        }
    } ,
    scene: [mainScene]
}

new Phaser.Game(config)