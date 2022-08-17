const Width = 1920
const Height = 1080

export class GameScene extends Phaser.Scene {
    private player: Phaser.Physics.Arcade.Sprite
    private timedEvent: Phaser.Time.TimerEvent
    private hits = 3
    private cd = 10
    private bigHP = 5
    private medHP = 3
    private smallHP = 2
    private score = 0
    private points: Phaser.GameObjects.Text
    private lives: Phaser.Physics.Arcade.Group
    private engine: Phaser.Physics.Arcade.Sprite
    private text: Phaser.GameObjects.Text
    private cooldown: Phaser.GameObjects.Text
    private laser: Phaser.Physics.Arcade.Sprite
    private special: Phaser.Physics.Arcade.Sprite
    private special2: Phaser.Physics.Arcade.Sprite
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private music: Phaser.Sound.BaseSound
    private tiasteroid: Phaser.Physics.Arcade.Sprite
    private smasteroid: Phaser.Physics.Arcade.Sprite
    private medasteroid: Phaser.Physics.Arcade.Sprite
    private bigasteroid: Phaser.Physics.Arcade.Sprite
    private shipcrash: Phaser.Physics.Arcade.World
    
    
    constructor() {
      super({
        key: 'GameScene'
      });
    }
    preload(){
        this.load.image('bg','assets/sprites/game/Backgrounds/purple.png')
        this.load.audio('laser1',['assets/sounds/sfx_laser1.mp3','assets/sounds/sfx_laser1.ogg'])
        this.load.audio('special',['assets/sounds/sfx_laser2.mp3','assets/sounds/sfx_laser2.ogg'])
        this.load.audio('lose',['assets/sounds/sfx_lose.mp3','assets/sounds/sfx_lose.ogg'])
        this.load.audio('warning',['assets/sounds/sfx_twoTone.mp3','assets/sounds/sfx_twoTone.ogg'])
        this.load.image('ship','assets/sprites/game/playerShip1_blue.png')
        this.load.audio('audio_bg',['assets/music/background_loop.mp3','assets/music/background_loop.ogg'])
        this.load.image('medasteroid',"assets/sprites/game/Meteors/meteorBrown_med1.png")
        this.load.image('tiasteroid',"assets/sprites/game/Meteors/meteorBrown_tiny1.png")
        this.load.image('smasteroid',"assets/sprites/game/Meteors/meteorBrown_small1.png")
        this.load.image('bigasteroid',"assets/sprites/game/Meteors/meteorBrown_big1.png")
        this.load.image('laser',"assets/sprites/game/Lasers/laserBlue03.png")
        this.load.image('special',"assets/sprites/game/Lasers/laserRed14.png")
        this.load.image('engine',"assets/sprites/game/Effects/fire14.png")
        this.load.image('life',"assets/sprites/game/UI/playerLife1_blue.png")
    }
    create(){
        this.cd = 0
        
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true })
        this.add.image(1920/2,1080/2,'bg').setDisplaySize(Width,Height)
        this.player = this.physics.add.sprite(Width/2,Height,'ship')
        this.player.setCollideWorldBounds(true)
        this.cursors = this.input.keyboard.createCursorKeys()
        this.sound.play('audio_bg',{mute:false,volume:0.3,loop:true})
        
        this.tiasteroid = this.physics.add.sprite((Phaser.Math.Between(20,1900)),(Phaser.Math.Between(-10,-100)),"tiasteroid")
        this.tiasteroid.setVelocityY(50)

        this.smasteroid = this.physics.add.sprite((Phaser.Math.Between(20,1900)),(Phaser.Math.Between(-10,-100)),"smasteroid")
        this.smasteroid.setVelocityY(50)

        this.medasteroid = this.physics.add.sprite((Phaser.Math.Between(20,1900)),(Phaser.Math.Between(-10,-100)),"medasteroid")
        this.medasteroid.setVelocityY(50)

        this.bigasteroid = this.physics.add.sprite((Phaser.Math.Between(20,1900)),(Phaser.Math.Between(-10,-100)),"bigasteroid")
        this.bigasteroid.setVelocityY(50)
        
        this.lives = this.physics.add.group({key:'life', repeat: this.hits-1,setXY:{x:1870,y:20,stepX:-50}})
       
        
        this.physics.add.collider([this.bigasteroid,this.tiasteroid,this.smasteroid,this.medasteroid], this.player, this.shipCrash, undefined,this)
        
        
        
        this.cooldown = this.add.text(160,10,`Cooldown: ${this.cd}`, {fontSize:'22px', color: '#fff'}).setOrigin(1,0)
        this.points = this.add.text(Width/2,10,`Score: ${this.score}`, {fontSize:'22px', color: '#fff'}).setOrigin(1,0)
    
        

        

    }
    update() {
      
      this.physics.add.overlap([this.tiasteroid],[this.laser],this.shootAsteroidT,undefined,this)
      this.physics.add.overlap([this.smasteroid],[this.laser],this.shootAsteroidS,undefined,this)
      this.physics.add.overlap([this.medasteroid],[this.laser],this.shootAsteroidM,undefined,this)
      this.physics.add.overlap([this.bigasteroid],[this.laser],this.shootAsteroidB,undefined,this)

      this.physics.add.collider([this.tiasteroid],[this.special,this.special2],this.specialAsteroidT,undefined,this)
      this.physics.add.collider([this.smasteroid],[this.special,this.special2],this.specialAsteroidS,undefined,this)
      this.physics.add.collider([this.medasteroid],[this.special,this.special2],this.specialAsteroidM,undefined,this)
      this.physics.add.collider([this.bigasteroid],[this.special,this.special2],this.specialAsteroidB,undefined,this)
      

       if (this.bigasteroid.y > 1090){
        this.bigasteroid.setY(Phaser.Math.Between(-10,-100))
        this.bigasteroid.setX(Phaser.Math.Between(20,1900))
        this.bigasteroid.setVelocityY(50)
       }
       if (this.medasteroid.y > 1090){
        this.medasteroid.setY(Phaser.Math.Between(-10,-100))
        this.medasteroid.setX(Phaser.Math.Between(20,1900))
        this.medasteroid.setVelocityY(50)
       }
       if (this.smasteroid.y > 1090){
        this.smasteroid.setY(Phaser.Math.Between(-10,-100))
        this.smasteroid.setX(Phaser.Math.Between(20,1900))
        this.smasteroid.setVelocityY(50)
       }
       if (this.tiasteroid.y > 1090){
        this.tiasteroid.setY(Phaser.Math.Between(-10,-100))
        this.tiasteroid.setX(Phaser.Math.Between(20,1900))
        this.tiasteroid.setVelocityY(50)
       }
      
      
      if(Phaser.Input.Keyboard.JustDown(this.cursors.shift)){

        
        if (this.cd == 0){
          this.cd = 10
          this.fireSpecial()

        }
        else{
          return
        }
        
        
      }

      if(Phaser.Input.Keyboard.JustDown(this.cursors.space)){
        
        this.fireBullet()
      
        
      }
       
       if (this.cursors.left.isDown){
        this.player.setVelocityX(-180)
        const engine = this.physics.add.sprite(this.player.x,this.player.y+30,'engine')
        this.time.delayedCall(300,()=>{
          engine.destroy()
        })
        
       }
       else if (this.cursors.right.isDown){
        this.player.setVelocityX(180)
        const engine = this.physics.add.sprite(this.player.x,this.player.y+30,'engine')
        this.time.delayedCall(300,()=>{
          engine.destroy()
        })
       }
       else if (this.cursors.up.isDown){
        this.player.setVelocityY(-180)
        const engine = this.physics.add.sprite(this.player.x,this.player.y+30,'engine')
        this.time.delayedCall(300,()=>{
          engine.destroy()
        })
       }
       else if (this.cursors.down.isDown){
        this.player.setVelocityY(180)
       }
       else {
        this.player.setVelocityX(0)
        this.player.setVelocityY(0)
       }
       if(this.hits==0){
        this.score = 0
        this.hits=3
        this.game.sound.play('lose',{volume:0.2})
        this.scene.pause
        this.scene.launch('GameOverScene')
       }
      
        
    }
  
    private fireBullet(){
      this.time.delayedCall(300,()=>{
        this.laser=this.physics.add.sprite((this.player.x),(this.player.y),'laser')
        this.laser.setVelocityY(-200)
        this.game.sound.play('laser1',{volume:0.15})
      })

    }
    private fireSpecial(){
      this.time.delayedCall(300,()=>{
        this.special=this.physics.add.sprite((this.player.x+45),(this.player.y),'special')
              this.special2=this.physics.add.sprite((this.player.x-45),(this.player.y),'special')
      this.special.setVelocityY(-250)
      this.special2.setVelocityY(-250)
      this.game.sound.play('special',{volume:0.15})
      
      })

    }

    private shipCrash(b: Phaser.GameObjects.GameObject, a: Phaser.GameObjects.GameObject){
      this.hits--
      
      this.lives.destroy(true)
      this.lives=this.physics.add.group({key:'life', repeat: this.hits-1,setXY:{x:1870,y:20,stepX:-50}})
      const player = a as Phaser.Physics.Arcade.Sprite
      const bigasteroid = b as Phaser.Physics.Arcade.Sprite
      const medasteroid = b as Phaser.Physics.Arcade.Sprite
      const smasteroid = b as Phaser.Physics.Arcade.Sprite
      const tiasteroid = b as Phaser.Physics.Arcade.Sprite
      player.disableBody(true,true)
      bigasteroid.disableBody(true,true)
      medasteroid.disableBody(true,true)
      smasteroid.disableBody(true,true)
      tiasteroid.disableBody(true,true)
      this.time.delayedCall(300,()=>{
        player.enableBody(true,Width/2,Height,true,true)
        this.enbableTiny(tiasteroid)
        
      })

      this.time.delayedCall(300,()=>{
        player.enableBody(true,Width/2,Height,true,true)
        this.enbableSmall(smasteroid)
        
      })
      this.time.delayedCall(300,()=>{
        player.enableBody(true,Width/2,Height,true,true)
        this.enbableMedium(medasteroid)
        
      })
      this.time.delayedCall(300,()=>{
        player.enableBody(true,Width/2,Height,true,true)
        this.enbableBig(bigasteroid)
        
        
      })
    }
    private specialAsteroidS(b: Phaser.GameObjects.GameObject, a: Phaser.GameObjects.GameObject){
      const special = a as Phaser.Physics.Arcade.Sprite
      const special2 = a as Phaser.Physics.Arcade.Sprite
      const smasteroid = b as Phaser.Physics.Arcade.Sprite
      special.destroy()
      special2.destroy()
      this.score += 2
      this.smasteroid.disableBody(true,true)
      const particles = this.add.particles('tiasteroid')
      particles.createEmitter({
        x: smasteroid.x,
        y:smasteroid.y,
        maxParticles: 5,
          quantity: 5,
          speed: 300,
          lifespan: 500,
          radial: true,
          alpha: { start: 1, end: 0.2, ease: 'Sine.easeIn' },
          scale: { start: 1, end: 0.4 },
          rotate: { min: -180, max: 180 },
      })
      this.time.delayedCall(300,()=>{
        this.points.setText(`Score: ${this.score}`)
        this.enbableSmall(smasteroid)
      })
    }
    private specialAsteroidM(b: Phaser.GameObjects.GameObject, a: Phaser.GameObjects.GameObject){
      const special = a as Phaser.Physics.Arcade.Sprite
      const special2 = a as Phaser.Physics.Arcade.Sprite
      const medasteroid = b as Phaser.Physics.Arcade.Sprite
      special.destroy()
      special2.destroy()
      this.score += 3
      this.medasteroid.disableBody(true,true)
      const particles = this.add.particles('smasteroid')
      particles.createEmitter({
        x: medasteroid.x,
        y:medasteroid.y,
        maxParticles: 5,
          quantity: 5,
          speed: 300,
          lifespan: 500,
          radial: true,
          alpha: { start: 1, end: 0.2, ease: 'Sine.easeIn' },
          scale: { start: 1, end: 0.4 },
          rotate: { min: -180, max: 180 },
      })
      
      this.time.delayedCall(300,()=>{
        this.points.setText(`Score: ${this.score}`)
        this.enbableMedium(medasteroid)
      })
    }
    private specialAsteroidB(b: Phaser.GameObjects.GameObject, a: Phaser.GameObjects.GameObject){
      const special = a as Phaser.Physics.Arcade.Sprite
      const special2 = a as Phaser.Physics.Arcade.Sprite
      const bigasteroid = b as Phaser.Physics.Arcade.Sprite
      special.destroy()
      special2.destroy()
      this.score += 5
      this.bigasteroid.disableBody(true,true)
      const particles = this.add.particles('medasteroid')
        particles.createEmitter({
          x: bigasteroid.x,
          y:bigasteroid.y,
          maxParticles: 5,
			quantity: 5,
			speed: 300,
			lifespan: 500,
			radial: true,
			alpha: { start: 1, end: 0.2, ease: 'Sine.easeIn' },
			scale: { start: 1, end: 0.4 },
			rotate: { min: -180, max: 180 },
        })
      
      this.time.delayedCall(300,()=>{
        this.points.setText(`Score: ${this.score}`)
        this.enbableBig(bigasteroid)
      })
    }
    private specialAsteroidT(b: Phaser.GameObjects.GameObject, a: Phaser.GameObjects.GameObject){
      const special = a as Phaser.Physics.Arcade.Sprite
      const special2 = a as Phaser.Physics.Arcade.Sprite
      const tiasteroid = b as Phaser.Physics.Arcade.Sprite
      special.destroy()
      special2.destroy()
      this.score += 1
      this.tiasteroid.disableBody(true,true)
      this.time.delayedCall(300,()=>{
        this.points.setText(`Score: ${this.score}`)
        this.enbableTiny(tiasteroid)
      })
    }
    private shootAsteroidT(b: Phaser.GameObjects.GameObject, a: Phaser.GameObjects.GameObject){
      const laser = a as Phaser.Physics.Arcade.Sprite
      const tiasteroid = b as Phaser.Physics.Arcade.Sprite
      laser.destroy()
      this.tiasteroid.disableBody(true,true)
      this.time.delayedCall(300,()=>{
        this.points.setText(`Score: ${this.score}`)
        this.score += 1
        this.enbableTiny(tiasteroid)
      })
    }
    private shootAsteroidS(b: Phaser.GameObjects.GameObject, a: Phaser.GameObjects.GameObject){
      const laser = a as Phaser.Physics.Arcade.Sprite
      const smasteroid = b as Phaser.Physics.Arcade.Sprite
      laser.destroy()
      if (this.smallHP==1){
        this.smallHP = 2
        this.score += 2
        this.smasteroid.disableBody(true,true)
        const particles = this.add.particles('tiasteroid')
        particles.createEmitter({
          x: smasteroid.x,
          y:smasteroid.y,
          maxParticles: 5,
			quantity: 5,
			speed: 300,
			lifespan: 500,
			radial: true,
			alpha: { start: 1, end: 0.2, ease: 'Sine.easeIn' },
			scale: { start: 1, end: 0.4 },
			rotate: { min: -180, max: 180 },
        })
      this.time.delayedCall(300,()=>{
        this.points.setText(`Score: ${this.score}`)
        this.enbableSmall(smasteroid)
      })

      }
      else{
        this.smallHP -= 1
      }
      
    }
    private shootAsteroidM(b: Phaser.GameObjects.GameObject, a: Phaser.GameObjects.GameObject){
      const laser = a as Phaser.Physics.Arcade.Sprite
      const medasteroid = b as Phaser.Physics.Arcade.Sprite
      laser.destroy()
      if (this.medHP==1){
        this.score += 3
        this.medHP = 3
        this.medasteroid.disableBody(true,true)
        const particles = this.add.particles('smasteroid')
        particles.createEmitter({
          x: medasteroid.x,
          y:medasteroid.y,
          maxParticles: 5,
			quantity: 5,
			speed: 300,
			lifespan: 500,
			radial: true,
			alpha: { start: 1, end: 0.2, ease: 'Sine.easeIn' },
			scale: { start: 1, end: 0.4 },
			rotate: { min: -180, max: 180 },
        })
      this.time.delayedCall(300,()=>{
        this.points.setText(`Score: ${this.score}`)
        this.enbableMedium(medasteroid)
      })
      

      }
      else{
        this.medHP -= 1
      }
      
    }
    private shootAsteroidB(b: Phaser.GameObjects.GameObject, a: Phaser.GameObjects.GameObject){
      const laser = a as Phaser.Physics.Arcade.Sprite
      const bigasteroid = b as Phaser.Physics.Arcade.Sprite
      laser.destroy()
      if (this.bigHP==1){
        this.score += 5
        this.bigHP = 5
        this.bigasteroid.disableBody(true,true)
        const particles = this.add.particles('medasteroid')
        particles.createEmitter({
          x: bigasteroid.x,
          y:bigasteroid.y,
          maxParticles: 5,
			quantity: 5,
			speed: 300,
			lifespan: 500,
			radial: true,
			alpha: { start: 1, end: 0.2, ease: 'Sine.easeIn' },
			scale: { start: 1, end: 0.4 },
			rotate: { min: -180, max: 180 },
        })
      this.time.delayedCall(300,()=>{
        this.enbableBig(bigasteroid)
        this.points.setText(`Score: ${this.score}`)
      })
      }
      else{
        this.bigHP -= 1

      }
      
    }

    private enbableBig(a: Phaser.GameObjects.GameObject){
      const bigasteroid = a as Phaser.Physics.Arcade.Sprite
      this.time.delayedCall(300,()=>{
        
        bigasteroid.enableBody(true,Phaser.Math.Between(20,1900),Phaser.Math.Between(-10,-100),true,true)
        bigasteroid.setVelocityY(50)
        
        
      })
    }
    private enbableSmall(a: Phaser.GameObjects.GameObject){
      const smasteroid = a as Phaser.Physics.Arcade.Sprite
      this.time.delayedCall(300,()=>{
        
        smasteroid.enableBody(true,Phaser.Math.Between(20,1900),Phaser.Math.Between(-10,-100),true,true)
        smasteroid.setVelocityY(50)
        
        
      })
    }
    private enbableTiny(a: Phaser.GameObjects.GameObject){
      const tiasteroid = a as Phaser.Physics.Arcade.Sprite
      this.time.delayedCall(300,()=>{
        
        tiasteroid.enableBody(true,Phaser.Math.Between(20,1900),Phaser.Math.Between(-10,-100),true,true)
        tiasteroid.setVelocityY(50)
        
        
      })
    }
    private enbableMedium(a: Phaser.GameObjects.GameObject){
      const medasteroid = a as Phaser.Physics.Arcade.Sprite
      this.time.delayedCall(300,()=>{
        
        medasteroid.enableBody(true,Phaser.Math.Between(20,1900),Phaser.Math.Between(-10,-100),true,true)
        medasteroid.setVelocityY(50)
        
        
      })
    }
    private formatTime(seconds: number){
      var partInSeconds = seconds%60
      
      return `${partInSeconds}`
    }
    private onEvent(){
      if (this.cd==0){
        this.cooldown.setText('Cooldown: ' + this.formatTime(this.cd));
      }
      else{
        this.cd -= 1; // One second
    this.cooldown.setText('Cooldown: ' + this.formatTime(this.cd));
      }
      
    }
   
  }