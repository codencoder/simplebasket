    var width = 320;
    var heigth = 480;

    var game = new Phaser.Game(width, heigth, Phaser.CANVAS, null, {
      preload: preload, create: create, update: update
    });

    var btnReleased = false;
    var upAreaCollide = false;
    var realSize = 1;
    var score = 0;
    var scoreText;
    var ringPositionRX;
    var ringPositionLX;
    var ringPositionY = 7.0;
    var ballWidth;
    var ballHeigth;
    var upOnRing = false;
    var levelUp = false;

    function preload() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = '#eee';
        game.load.image('background', 'img/background.png');
        game.load.image('ball', 'img/basketball.png');
        game.load.image('ground', 'img/ground.png');
        game.load.image('area', 'img/area.png');
        game.load.image('uparea', 'img/uparea.png');
        game.load.image('backboard', 'img/backboard.png');
        game.load.image('basketring', 'img/basketring.png');
        game.load.image('throw', 'img/throw.png');
    }
    
    function create() {

        backboardringHeigth = 40;
        backboardWidth = game.cache.getImage("backboard").width;
        background = game.add.image(0, 0, 'background');
        backboard = game.add.sprite(width*0.5 - backboardWidth*0.5, backboardringHeigth, 'backboard');
        game.physics.enable(backboard, Phaser.Physics.ARCADE);
        backboard.body.collideWorldBounds = true;
        backboard.body.bounce.setTo(1, 0.35);
        backboard.body.velocity.set(0, 0);

        ringPositionY = ringPositionY + backboard.body.y;

        area = game.add.image(0, 180, 'area');
        
        ball = game.add.sprite(game.world.centerX, game.world.height-80, 'ball');
        ballWidth = game.cache.getImage("ball").width;
        game.physics.enable(ball, Phaser.Physics.ARCADE);
        
        ball.body.collideWorldBounds = true;
        ball.body.gravity.y = 30;
        ball.body.bounce.setTo(1, 0.35);
        ball.body.velocity.set(150, 0);
        ball.scale.setTo(1);

        uparea = game.add.sprite(0, 220, 'uparea');
        game.physics.enable(uparea, Phaser.Physics.ARCADE);
        uparea.body.immovable = true;

        ground = game.add.sprite(0, game.world.height-30, 'ground');
        game.physics.enable(ground, Phaser.Physics.ARCADE);
        
        ground.body.immovable = true;

        throwBtn = game.add.sprite(260, game.world.height-25, 'throw');
        game.physics.enable(throwBtn, Phaser.Physics.ARCADE);
        throwBtn.scale.setTo(1);

        cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]); 
        
        
        scoreText = this.add.text(10, game.world.height - 29, 'Score: 0', { fontSize: '24px', fill: '#000' });
    }

    function update() {

        if (score == 1 && levelUp == false) {
            backboard.body.velocity.x = 50;
            levelUp = true;
        }

        game.physics.arcade.collide(ball, ground);

        ringPositionLX = backboard.body.x + 21;
        ringPositionRX = ringPositionLX + 28;

        ballBottom = ball.body.y - 30;

        if (ballBottom < ringPositionY && upOnRing == false) 
        {
            upOnRing = true;
        }   
        
        if (ball.body.y < uparea.body.y - 20.0){
             game.physics.arcade.collide(ball, uparea); 
        }
       
        if (!btnReleased && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            btnReleased = true;
            throwBall();      
        }
           
        if (ball.body.y < 10.0){
            ball.body.velocity.set(0, 0);
        }
    
        if (btnReleased && realSize > 0.5){
            realSize = realSize - 0.002;
            ball.scale.setTo(realSize);
        }

        if (game.input.mousePointer.isDown){
            if(Phaser.Rectangle.contains(throwBtn.body, game.input.x, game.input.y)){
                setBallPosition();
            }
        }

        if ((ringPositionLX - 5 < ball.body.x && ball.body.x < ringPositionRX + 5)  
            && (ringPositionY - 5.0 < ballBottom && ballBottom > ringPositionY + 5.0)
            && upOnRing)
        {
            collectScore();
            upOnRing = false;
        }
    }

    function throwBall() {
        ball.body.velocity.set(0, -200);
    }

    function setBallPosition() {
        realSize = 1;
        btnReleased = false;
        upOnRing = false;
        ball.body.x = game.world.width*0.5;
        ball.body.y = game.world.height-80;
        ball.body.velocity.set(150, 0);
        ball.scale.setTo(1);
    }    

    function collectScore()
    {
        score += 1;
        scoreText.setText('Score: ' + score);
    }