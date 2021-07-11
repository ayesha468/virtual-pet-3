var dog,dogImg,dogImg1
var happyDog
var foodS,foodStock
var database
var fedTime,lastFed,feed,addFood,foodObj
var gameState,readState
var bedroom,garden,washroom
var currentTime

function preload(){
dogImg=loadImage("images/dogImg.png")
happyDog=loadImage("images/dogImg1.png")
bedroom=loadImage("images/Bed Room.png")
washroom=loadImage("images/Wash Room.png")
garden=loadImage("images/Garden.png")
}

function setup(){
  database=firebase.database();
    createCanvas(900,500);
    
    dog = createSprite(250,250,10,10);
    dog.addImage(dogImg)
    dog.scale=0.15

    feed=createButton("Feed The Dog")
    feed.position(700,95);
    feed.mousePressed(feedDog);

    addFood=createButton("Add Food")
    addFood.position(800,95);

    fedTime=database.ref('FeedTime')
    fedTime.on("value",function(data){
      lastFed=data.val()
    });

    foodObj=new Food()

    foodStock=database.ref('Food')
    foodStock.on("value",readStock)

    readState=database.ref('GameState')
    readState.on("value",function(data){
      gameState=data.val()
    });

    
    addFood.mousePressed(addFoods);

    

}


function draw(){

  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }
  else if (currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry")
    foodObj.display();
  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }


 drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
}

function feedDog(){
  dog.addImage(happyDog);
  
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}
function addFoods(){
  foodS++

  database.ref('/').update({
  Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}




