
const Width = 1920
const Height = 1080

export class GameOverScene extends Phaser.Scene{
    constructor() {
      super({
        key: 'GameOverScene'
      });
    }
    preload(){
      this.load.image('button',"assets/sprites/game/UI/buttonBlue.png")
      this.load.image('bg','assets/sprites/game/Backgrounds/blue.png')

    }
    create(){
      this.add.image(1920/2,1080/2,'bg').setDisplaySize(Width,Height)
      
      this.add.image(Width/2,Height/2,'button').setDisplaySize(444,78).setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN,()=> {this.scene.start('GameScene')})
      this.add.text(788,520,'Restart Game',{fontSize:'50px', color: '#36BBF5'})

    }
  }