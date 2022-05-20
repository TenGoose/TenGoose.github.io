export default class mainScene extends Phaser.Scene {
  constructor() {
    super("mainScene");
    this.ground;
    this.platforms;
    this.coins;
    this.butchers;
    this.player;
    this.cursor;
    this.speedBooster;
  }
  preload() {
    this.load.image("sky", "../brod/assets/sky.png");
    this.load.image("ground", "../brod/assets/ground.png");
    this.load.image("coin", "../brod/assets/coin.png", {
      frameWidth: 30,
      frameHeight: 30,
    });
    this.load.image("speedBooster", "../brod/assets/boosters/speed.png", {
    
    });
    this.load.image("platform", "../brod/assets/platform.png");
    this.load.spritesheet("player", "../brod/assets/maingg/player.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image("butcher", "../brod/assets/Enemies/butcher.png");
    this.load.audio("ding", "../brod/assets/ding.wav");
  }

  create() {
    // Sky
    this.add.image(400, 300, "sky");
    // Ground
    this.ground = this.physics.add.staticGroup();
    this.ground.create(400, 600, "ground");

    // Platforms
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(50, 500, "platform");
    this.platforms.create(200, 350, "platform");
    this.platforms.create(375, 200, "platform");
    this.platforms.create(550, 350, "platform");
    this.platforms.create(700, 500, "platform");
    this.platforms.create(700, 100, "platform");

    // Player
    this.player = this.physics.add.sprite(100, 100, "player");
    this.player.setCollideWorldBounds(true);
    this.playerSpeed = 200;
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.ground);

    // Cursors
    this.cursors = this.input.keyboard.createCursorKeys();

    // Jump realization
    this.isjumping = false;
    this.jumpCount = 0;
    this.jump = () => {
      this.isjumping = true;
      this.player.setVelocityY(-330);
    };

    // Move functions
      this.moveLeft = () => {
       this.player.setVelocityX(-this.playerSpeed);
     };
      this.moveRight = () => {
       this.player.setVelocityX(this.playerSpeed);
      };

    // Coins
    this.coinsCount = 0;
    this.coinText = this.add.text(16, 16, "Монеток собрано: 0", {
      fontSize: "18px",
      fill: "#eee",
    });
    this.coins = this.physics.add.staticGroup();
    let coinsArr = [
      this.coins.create(45, 460, "coin"),
      this.coins.create(210, 310, "coin"),
      this.coins.create(365, 140, "coin"),
      this.coins.create(710, 460, "coin"),
      this.coins.create(550, 150, "coin"),
    ];
    this.updateCoinsCount = () => {
      this.coinsCount += 1;
      this.coinText.text = `Монеток собрано: ` + this.coinsCount;
    };
    this.playCoinSound = () => {
      this.ding.play();
    };
    this.takeCoin = (coin) => {
      this.updateCoinsCount();
      this.playCoinSound();
      coin.destroy();
    };
    coinsArr.forEach((coin) => {
      this.physics.add.overlap(coin, this.player, this.takeCoin);
    });

    // Coins sound
    this.ding = this.sound.add("ding", { loop: false });

    //Speed Booster
    this.speedBoosters = this.physics.add.staticGroup();
    this.speedBoostersArr = [
      this.speedBoosters.create(400, 160, "speedBooster"),
      this.speedBoosters.create(500, 240, "speedBooster")
    ]
    this.speedBoost = (speedBooster) => {
      this.playerSpeed *= 1.25;
      speedBooster.destroy();
    }
    this.speedBoostersArr.forEach(speedBooster => {
      this.physics.add.overlap(speedBooster, this.player, this.speedBoost);
    });

    // Butchers
    this.butchers = this.physics.add.group();
    this.butchers.add.body = true;

    this.butchersArr = [
      this.butchers.create(670, 468, "butcher"),
      this.butchers.create(745, 68, "butcher"),
      this.butchers.create(380, 568, "butcher"),
    ];

    this.killBucher = (butcher) => {
      this.butchers.kill(butcher);
      butcher.destroy();
    }

    this.restartGame = () => {
      this.scene.restart();
    }
    this.butchersArr.forEach(butcher => {
      this.physics.add.collider(butcher, this.platforms);
      this.physics.add.collider(butcher, this.ground);
      this.physics.add.collider(butcher, this.player, this.restartGame);
    });
   
  }

  update() {
    this.isPlayerOnGround = this.player.body.touching.down;
    console.log(this.playerSpeed)
    if (this.cursors.left.isDown) {
      this.moveLeft();
    } else if (this.cursors.right.isDown) {
      this.moveRight();
    } else {
      this.player.setVelocityX(0);
    }

    if (this.isPlayerOnGround) {
      this.jumpCount = 0;
      this.isjumping = false;
    }

    if (
      this.cursors.up.isDown &&
      Phaser.Input.Keyboard.JustDown(this.cursors.up) &&
      this.jumpCount < 2
    ) {
      this.jump();
      this.jumpCount += 1;
    }
    if (this.coinsCount === 5) {
      this.add.text(50, 300, "Нихуя ты че могешь, а меня научишь?", {
        fontSize: "32px",
        fill: "red",
      });
    }
  }
}
