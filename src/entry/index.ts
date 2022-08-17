import '../../assets/html/style.css'
import * as Phaser from 'phaser'
import { GameScene } from '../scenes/GameScene'
import { GameOverScene } from '../scenes/GameOverScene' 



const config : Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scene: [GameScene, GameOverScene],
    physics: {
        default:'arcade'
    },
    scale: {
        mode: Phaser.Scale.FIT
    },
    width: 1920,
    height: 1080
}



export default new Phaser.Game(config)




