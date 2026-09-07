document.addEventListener("DOMContentLoaded", () => {
let game_container = document.querySelector(".game-container")
let score = document.querySelector(".score h1")
let pipe = document.querySelector(".obstacle")
let mario = document.querySelector(".mario")

let gameContainerWidth = game_container.offsetWidth;

/** Basic functions : 
     * Jump/fall ✅
     * move left ✅
     * move right ✅
     * move obstacle ✅
     * collision ✅
*/

let isJumping = false;
let isMovingLeft = false;
let isMovingRight = false;
let gameScore = 0;

let marioPosition = 0;

//jump
function jump(){
    if(isJumping) return;

    isJumping = true;

    let startPosition = 95;
    let endPosition = 395;
    let velocity = 12;

    let jumpInterval = setInterval(() =>{
        if(startPosition <= endPosition){
            startPosition += velocity;
            mario.style.bottom =  startPosition + "px";
        }
        else{
            clearInterval(jumpInterval);
            fall();
        }  
    },20)
}


//fall
function fall(){
    let startPosition = 395;
    let endPosition = 95;
    let velocity = 12 ;

    let fallInterval = setInterval(() => {
           if(startPosition >  endPosition){
               startPosition -= velocity;
               mario.style.bottom =  startPosition + "px";
        }
        else{
            clearInterval(fallInterval);
            isJumping = false;
        }  
    }, 20);
}

//move Mario player
function moveMario(direction){
    let movement = 20;
    let position;

    if(direction === "right"){
        position =  marioPosition + movement ;
        mario.classList.remove("flipped");
    }
    else{
        position =  marioPosition - movement ;
        mario.classList.add("flipped");
    }

    var maxPosition = gameContainerWidth - mario.offsetWidth;

    if(position >= 0 && position <= maxPosition){
        marioPosition = position;
        mario.style.left = marioPosition + "px";
    }
}


// move Obstacle i.e. pipe
function moveObstacle(){
    let obstaclePosition = gameContainerWidth + 50;
    pipe.style.left = obstaclePosition + "px";
    
    let movement = 10;
    
    //pipe move logic
    let obstacleInterval = setInterval(() =>{

        if(checkCollision(obstaclePosition)){
            clearInterval(obstacleInterval)  
            gameOver();
            return;
        }

        pipe.style.display = "block";
        obstaclePosition -= movement
        pipe.style.left = obstaclePosition + "px";
        
        //pipe reset logic
        if(obstaclePosition <= -100){
            obstaclePosition =  gameContainerWidth + Math.random() * 500 + 20;
            pipe.style.left = obstaclePosition + "px";

            gameScore++;
            score.textContent = `Score : ${gameScore}` 
        }

    }, 20)
}

//collision condition
function checkCollision(obstaclePosition){

    var marioLeft = mario.getBoundingClientRect().left
    var marioRight = mario.getBoundingClientRect().right
    var marioTop = mario.getBoundingClientRect().top 
    var marioBottom = mario.getBoundingClientRect().bottom

    var pipeLeft = pipe.getBoundingClientRect().left
    var pipeRight = pipe.getBoundingClientRect().right
    var pipeTop = pipe.getBoundingClientRect().top ;
    var pipeBottom = pipe.getBoundingClientRect().bottom

    let xCollision = marioRight >= pipeLeft && marioLeft <= pipeRight;
    let yCollision = marioBottom >= pipeTop && marioTop <= pipeBottom;

    return xCollision && yCollision;
}


//game over
function gameOver(){
    console.log("game over")
    score.textContent = `Game Over!  Your final Score: ${gameScore}`
}

//window events
window.addEventListener("keydown", (e)=>{
    switch(e.key){
        case " ":
        case "ArrowUp":
        case "w":
        case "W":
            jump();
            break;

        case "ArrowLeft" : 
            case "a" :
                case "A" :
                moveMario("left")
                break;

        case "ArrowRight":
            case "d":
                case "D":
                    moveMario("right")
                    break;
    }
})

setTimeout(() =>{
    moveObstacle()
}, 1000)
});