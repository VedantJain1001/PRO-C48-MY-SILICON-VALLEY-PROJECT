var earth, earthImg;
var earthDestroy;

var spaceImg, gameOverImg, youWinImg;

var menuScreenImg;

var gameOverMusic, gameWinMusic;

var asteroid1, asteroid1Img;
var asteroid2, asteroid2Img;
var asteroid3, asteroid3Img;
var asteroid4, asteroid4Img;
var asteroids1Grp, asteroids2Grp;

var missileArray = [];
var asteroidArray = [];

var astronaut, astronautImg1;
var astronautGrp;

var player, playerImg;

var missile, missileImg;
var missileGrp;

var points = 0;
var lifes = 3;

var life;
var life3, life2, life1;

var START_SCREEN = 2;
var PLAY = 1;
var END = 0;
var WIN = -1;
var gameState = 2;


function preload (){ 
  gameOverMusic = loadSound("explosion.mp3");
  menuScreenImg = loadImage("MenuScreen.png");
  spaceImg = loadImage("Space.png");
  earthImg = loadImage("Earth.png");
  earthDestroy = loadImage("Earth_Destroyed.png");
  gameOverImg = loadImage("GameOver.png");
  youWinImg = loadImage("YouWin.png");  

  asteroid1Img = loadImage("Asteroid1.png");
  asteroid2Img = loadImage("Asteroid2.png");
  asteroid3Img = loadImage("Asteroid3.png");
  asteroid4Img = loadImage("Asteroid4.png");

  astronautImg1 = loadImage("astronaut.png");

  playerImg = loadImage("player.png");

  missileImg = loadImage("Missile.png");

  life3 = loadImage("Lifes3.png");
  life2 = loadImage("Lifes2.png");
  life1 = loadImage("Lifes1.png");
}

function setup (){
  createCanvas(2400,1100);

  life = createSprite(860,40,200,50);
  life.scale = 0.6;

  missile = createSprite(1100,-40,50,50); 

  earth = createSprite(2600,550,20,200);
  earth.addImage(earthImg);
  earth.scale = 4;
  earth.setCollider("circle",0,0,200);
  
  player = createSprite(1800,180,20,200);
  player.addImage(playerImg);
  player.scale = 0.3; 
  player.setCollider("rectangle",0,0,550,200);

  asteroids1Grp = createGroup();
  asteroids2Grp = createGroup(); 
  astronautGrp = createGroup();
  missileGrp = createGroup();

  
  //gameOverMusic.isLooping = false;
}

function draw (){
  background(spaceImg);    

  if(keyWentDown("R")){
    gameState = 2;
    earth.addImage(earthImg);
    gameOverMusic.stop();
  }

  if(gameState === START_SCREEN){
    if(keyDown("P") /*|| mouseIsPressed*/){
      gameState = 1;
    }

    

    life.visible = false;
    player.visible = false;
    earth.visible = false;

    background(menuScreenImg);
    if(keyWentDown(49)){
      gameState = PLAY;
    }
  }

  if(gameState === PLAY){
    asteroids1();
    asteroids2();
    createAstronaut();    
    console.log(lifes);

    life.visible = true;
    player.visible = true;
    earth.visible = true;

    earth.debug = true;
    player.debug = true;

    if(keyDown("UP_ARROW")){
      player.y = player.y - 20;
    }

    if(keyDown("DOWN_ARROW")){
      player.y = player.y + 20;
    }

    if (asteroids1Grp.collide(player)){
      asteroids1Grp.destroyEach();
      lifes = lifes - 1;
    }
    if (asteroids2Grp.collide(player)){
      asteroids2Grp.destroyEach();
      lifes = lifes - 1;
    }    

    if(asteroids1Grp.collide(missileGrp)){
      asteroids1Grp.destroyEach();
      missile .destroy();
    }

    if(asteroids2Grp.collide(missileGrp)){
      asteroids2Grp.destroyEach();
      missile.destroy();
    }

    if(astronautGrp.collide(player)){
      astronautGrp.destroyEach();
      points = points + 1;
    } 

    if(astronautGrp.collide(earth)){
      astronautGrp.destroyEach();
      points = points - 1;
    }

    if(earth.collide(asteroids1Grp)){
      gameState = END;
    }
    if(earth.collide(asteroids2Grp)){
      gameState = END;
    }

    if(keyWentDown("space")){  
      createMissile();
    }
    else if(keyWentUp("space")){      
    }

    fill("WHITE");
    stroke("BLACK");
    strokeWeight("10");
    textSize(40);
    textFont("Segoe Script");
    text(points, 1200, 50);
    text("Score: ", 1000, 50)

    if(lifes === 0){
      gameState = END;
    }

    if(points === 10){
      gameState = WIN;
    }

    if(lifes === 3){
      life.addImage("life", life3);
    }

    if(lifes === 2){
      life.addImage("life", life2);
    }

    if(lifes === 1){
      life.addImage("life", life1);
    }
  }

  if(gameState === END){
    earth.velocityX = 0;
    earth.velocityY = 0;
    points = 0;
    lifes = 3;
    life.visible = false;
    earth.addImage(earthDestroy);
    earth.scale = 3;
    asteroids1Grp.destroyEach(); 
    asteroids2Grp.destroyEach();
    missileGrp.destroyEach();
    astronautGrp.destroyEach();
    gameOverMusic.play();
    setTimeout(function (){
      gameState = 3;
    },200);
    clearTimeout();
    
  }

  if(gameState === 3){
    gameOverMusic.stop();
    fill("WHITE");
    stroke("BLACK");
    strokeWeight("10");
    textSize(100);
    textFont("Segoe Script");
    text("Press 'R' to restart", 600, 550);
  }

  if(gameState === WIN){
    earth.destroy();
    player.destroy();
    life.visible = false;
    asteroids1Grp.destroyEach(); 
    asteroids2Grp.destroyEach();  
    asteroids1Grp.setVelocityXEach(0);  
    asteroids2Grp.setVelocityXEach(0);
    missileGrp.destroyEach();
    astronautGrp.destroyEach();
    background(youWinImg);
  }

  drawSprites();
}

function asteroids1 (){
  if(World.frameCount % 100 === 0){
    asteroid1 = createSprite(-20,200,20,200);
    asteroid1.scale = 0.4;
    r = Math.round(random(1,2));
    if (r == 1){
      asteroid1.addImage(asteroid1Img);  
    } 
    else if (r == 2){
      asteroid1.addImage(asteroid2Img);  
    }
    asteroid1.y = Math.round(random(10,1050));  
    asteroid1.velocityX = 14;
    asteroids1Grp.add(asteroid1);    
  }
}

function asteroids2 (){
  if(World.frameCount % 200 === 0){
    asteroid2 = createSprite(-20,500,20,200);
    asteroid2.scale = 0.5;
    r = Math.round(random(3,4));
    if (r == 3){
      asteroid2.addImage(asteroid3Img);  
    } 
    else if (r == 4){
      asteroid2.addImage(asteroid4Img);  
    }  
    asteroid2.y = Math.round(random(30,1050));  
    asteroid2.velocityX = 14;
    asteroids2Grp.add(asteroid2);
  }
}

function createMissile(){
  missile = createSprite(1800,-40,50,50); 
  missile.y = player.y+30;
  missile.addImage(missileImg);
  missile.scale = 0.2;
  missile.velocityX = -10;
  missile.lifetime = 200; 
  missileGrp.add(missile); 
}

function createAstronaut(){
  if(World.frameCount % 250 === 0){
    astronaut = createSprite(-20,500,20,200);
    astronaut.scale = 0.3;
    astronaut.addImage(astronautImg1); 
    astronaut.y = Math.round(random(30,670));  
    astronaut.velocityX = 15;
    astronautGrp.add(astronaut);
  }  
}
