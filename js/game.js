window.onload = function() {
    var canvas = document.querySelector("canvas");
    var winScreen = document.getElementsByClassName("winScreen")[0];
    var winMessage = document.getElementById("winMessage");
    var scoreMessage = document.getElementById("score");
    var playAgain = document.getElementById("winButton");
    //My browser seems to not want to fit to screen - adds scroll bars. This is a temp. Workaround
    //Making sure the height doesn't stretch the game board too much
    var innerHeight = (window.innerHeight> 670)? 670 : window.innerHeight-6;
    var innerWidth = (window.innerWidth > 1350)? 1350 : window.innerWidth-6;
    var c = canvas.getContext("2d");
    var boardHeight = Math.ceil(innerHeight/6);
    var boardWidth = Math.ceil(innerWidth/7);
    var lineCoordsX = []
    var lineCoordsY = []
    var score = [0,0];
    var newCoords = [
        x = undefined,
        y = undefined
    ];
    var chipArray = [];
    //start color
    var color = "red";
    var columnList = {};
    var columnListY = {};
        
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    //To avoid weird sliding animations later on, I'm going to declare the width here
    winScreen.style.width = canvas.width + "px";

    function Chip(x,y,color, rad){
        this.x = x;
        this.y = y;
        this.color = color;
        //I'd like rad to be derrived from the screen size as well -- specifically height. Would require the change to be made in the drawgrid too
        this.rad = rad;
        
        this.create = function(){
            c.beginPath();
            c.arc(this.x, this.y, this.rad, 0, Math.PI*2);
            c.fillStyle = this.color;
            c.fill();
            c.stroke();
        }
    }
    
    function drawGrid() {
        //creating rows
        for(var i = 0; i<7; i++) {
            c.moveTo(0, boardHeight*i);
            c.lineTo(innerWidth, boardHeight*i);
            c.stroke();
            lineCoordsY.push(boardHeight*i);
        }
        //creating columns
        for(var i = 0; i<8; i++) {
            c.moveTo(boardWidth*i, 0);
            c.lineTo(boardWidth*i, innerHeight);
            c.stroke();
            lineCoordsX.push(boardWidth*i);
        }
        
        //Making our column list for first move drop
        for(var i = 0; i<lineCoordsX.length; i++) {
            if(i!=lineCoordsX.length-1){
                columnList [(lineCoordsX[i]+lineCoordsX[i+1])/2] = 0;
            }
        }        
        //Making our row list for first move drop
        for(var i = 0; i<lineCoordsY.length; i++) {
            if(i!=lineCoordsY.length-1){
                columnListY [(lineCoordsY[i]+lineCoordsY[i+1])/2] = 0;
            }
        }
        
        let xCenters = Object.keys(columnList);
        let yCenters = Object.keys(columnListY);
        
        for(var j = 0; j<yCenters.length; j++){
            
            for(var i = 0; i<xCenters.length; i++){
                c.beginPath()
                c.arc(xCenters[i], yCenters[j], 41, 0, Math.PI*2);
                c.fillStyle = "white";
                c.fill();
                c.stroke();
            }
        }
    }   
    
    function chipPosition(e) {
        var xCount = 0;
        //Centering the Chips
        while(true){
            //If the coords are larger than the line, we're not interested.
            if(e.x > lineCoordsX[xCount]){
                xCount ++;
            //Checking for our far right line
            } else if (e.x <= lineCoordsX[xCount]){
                //Centering the click
                newCoords.x = (lineCoordsX[xCount] + lineCoordsX[xCount-1])/2;
                break;
            }
        }
        var yCount = 0;
        while(true){
            if(e.y > lineCoordsY[yCount]){
                yCount++;
            } else if(e.y <= lineCoordsY[yCount]){
                newCoords.y = (lineCoordsY[yCount] + lineCoordsY[yCount-1])/2
                break;
            }
        }
    //Going to re-do this with a column JSON formatter to be more efficient in the future. Right now, I'm using it to determine if the chip goes to the bottom and keeping my old messy/ineffiecient code.
        if(columnList [newCoords.x] == 0){
            //if there's nothing currently in the column, we send the chip to the bottom
            newCoords.y = (lineCoordsY[lineCoordsY.length-1] + lineCoordsY[lineCoordsY.length-2])/2
            columnList [newCoords.x] +=1;
        } else {
            //otherwise, we run these check
            for(var i = 0; i<chipArray.length; i++) {
                //Checking to see if anything is in the same position
                if(newCoords.x == chipArray[i].x && newCoords.y == chipArray[i].y){
                    //popping it up to the top if there is
                    newCoords.y -= boardHeight;
                // If there is not a chip at the tile...
                } else if (newCoords.x == chipArray[i].x && newCoords.y != chipArray[i].y){
                    //We check for as long as necessary down the column until we find an occupied space
                    while(true) {
                        newCoords.y += boardHeight;
                        if(newCoords.x == chipArray[i].x && newCoords.y != chipArray[i].y){
                            continue;
                        //when we find the occupied space, we backtrack one, and put the chip there.
                        } else if (newCoords.x == chipArray[i].x && newCoords.y == chipArray[i].y){
                            newCoords.y-= boardHeight;
                            break;
                        } 
                    }
                } 
            }
            //Adding the chip to the appendix of chips
            columnList [newCoords.x] +=1;
        }
    }
    
    function chipCheck(){
        if(color == "red") {
            chipArray.push(new Chip(newCoords.x, newCoords.y, "red", 40))
            chipArray[chipArray.length-1].create();
            winChecker(chipArray[chipArray.length-1], "right");
            winChecker(chipArray[chipArray.length-1], "upright");
            winChecker(chipArray[chipArray.length-1], "up");
            winChecker(chipArray[chipArray.length-1], "botright");
            color = "yellow";
           } else if(color == "yellow"){
            chipArray.push(new Chip(newCoords.x, newCoords.y, "yellow", 40))
            chipArray[chipArray.length-1].create();
            winChecker(chipArray[chipArray.length-1], "right");
            winChecker(chipArray[chipArray.length-1], "upright");
            winChecker(chipArray[chipArray.length-1], "up");
            winChecker(chipArray[chipArray.length-1], "botright");
            color = "red";
        }
    }
    
    function winChecker(chip, dir) {    
        let fwdCount = 0;
        let bckCount = 0;
    
        //I could not think of a way to condense this any more than it already is. Suggestions are welcome.
    
        if(dir == "right"){
            //  ---
            let checkFwd = chipArray.find(function(obj) {return (obj.x === chip.x+boardWidth && obj.y === chip.y);});
            while(true){
                if(checkFwd!== undefined){
                    if(checkFwd.color == chip.color){
                        fwdCount++;
                        //comparing the original to the next one in line if any
                        checkFwd = chipArray.find(function(obj) {return (obj.x === chip.x+(boardWidth*(fwdCount+1)) && obj.y === chip.y);});
                        if(fwdCount == 3){
                            winTrue(color);
                            break;
                        }
                    } else {
                        //No color match
                        break;
                    }
                } else {
                    //No chip in that direction
                    break;
                }
            }
            //Looking backwards
            let checkBck = chipArray.find(function(obj) {return (obj.x === chip.x-boardWidth && obj.y === chip.y);});            
            while(true){
                if(checkBck!== undefined){
                    if(checkBck.color == chip.color){
                        bckCount++;
                        //comparing the original to the next one in line if any
                        checkBck = chipArray.find(function(obj) {return (obj.x === chip.x-(boardWidth*(bckCount+1)) && obj.y === chip.y);});
                        if(fwdCount == 3 || bckCount + fwdCount == 3){
                            winTrue(color);
                            break;
                        }
                    } else {
                        //No color Match
                        break;
                    }
                } else {
                    //No Chip in that direction
                    break;
                }
            }
        } 
        else if (dir == "upright"){
            // /
            let checkUpFwd = chipArray.find(function(obj) {return (obj.x === chip.x+boardWidth && obj.y === chip.y-boardHeight);});
            
            while(true){
                if(checkUpFwd!== undefined){
                    if(checkUpFwd.color == chip.color){
                        fwdCount++;
                        checkUpFwd = chipArray.find(function(obj) {return (obj.x === chip.x+(boardWidth*(fwdCount+1)) && obj.y === chip.y-(boardHeight*(fwdCount+1)));})
                        if(fwdCount == 3){
                            winTrue(color);
                            break;
                        }
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }        
    
            let checkUpBck = chipArray.find(function(obj) {return (obj.x === chip.x-boardWidth && obj.y === chip.y+boardHeight);});
            while(true){
                if(checkUpBck!== undefined){
                    if(checkUpBck.color == chip.color){
                        bckCount++;
                        checkUpBck = chipArray.find(function(obj) {return (obj.x === chip.x-(boardWidth*(bckCount+1)) && obj.y === chip.y+(boardHeight*(bckCount+1)));});
                        if(fwdCount == 3 || bckCount + fwdCount == 3){
                            winTrue(color);
                            break;
                        }
                    } else {
                        //No color Match
                        break;
                    }
                } else {
                    //No Chip in that direction
                    break;
                }
            }
            
        } 
        else if (dir == "up"){
            // |
            //We only need to check down because gravity
              let checkDown = chipArray.find(function(obj) {return (obj.x === chip.x && obj.y === chip.y+boardHeight);});

                while(true){
                if(checkDown!== undefined){
                    if(checkDown.color == chip.color){
                        bckCount++;
                        checkDown = chipArray.find(function(obj) {return (obj.x === chip.x && obj.y === chip.y+(boardHeight*(bckCount+1)));});
                        if(fwdCount == 3 || bckCount + fwdCount == 3){
                            winTrue(color);
                            break;
                        }
                    } else {
                        //No color Match
                        break;
                    }
                } else {
                    //No Chip in that direction
                    break;
                }
            }
        } 
        else if (dir == "botright"){
            // \
            let checkDownFwd = chipArray.find(function(obj) {return (obj.x === chip.x+boardWidth && obj.y === chip.y+boardHeight);});
            while(true){
                if(checkDownFwd!== undefined){
                    if(checkDownFwd.color == chip.color){
                        bckCount++;
                        checkDownFwd = chipArray.find(function(obj) {return (obj.x === chip.x+(boardWidth*(bckCount+1)) && obj.y === chip.y+(boardHeight*(bckCount+1)));});
                        if(fwdCount == 3 || bckCount + fwdCount == 3){
                            winTrue(color);
                            break;
                        }
                    } else {
                        //No color Match
                        break;
                    }
                } else {
                    //No Chip in that direction
                    break;
                }
            }
            let checkDownBck = chipArray.find(function(obj) {return (obj.x === chip.x-boardWidth && obj.y === chip.y-boardHeight);}); 
            
            while(true){
                if(checkDownBck!== undefined){
                    if(checkDownBck.color == chip.color){
                        bckCount++;
                        checkDownBck = chipArray.find(function(obj) {return (obj.x === chip.x-(boardWidth*(bckCount+1)) && obj.y === chip.y-(boardHeight*(bckCount+1)));});
                        if(fwdCount == 3 || bckCount + fwdCount == 3){
                            winTrue(color);
                            break;
                        }
                    } else {
                        //No color Match
                        break;
                    }
                } else {
                    //No Chip in that direction
                    break;
                }
            }
        }

    }
    function winTrue(color){
        //Was running into issues having this completely styled in the CSS file (mostly z-index related things where you would be clicking on the div not the canvas) so I put it here instead
        //This also adds the benefit of stopping the player from making moves once a win has been detected
        
        if(color == "red") {
            score[0] +=1;
            winMessage.style.color = "white";
            scoreMessage.style.color = "white";
        } else if(color == "yellow") {
            score[1] +=1;
            winMessage.style.color = "black";
            scoreMessage.style.color = "black";
        }
        winMessage.style.marginTop = (boardHeight) + "px";
        winMessage.innerHTML = "Winner: " + color + "!";
        scoreMessage.innerHTML = "Red: " + score[0] + "<br/>Yellow: " + score[1];
        winScreen.style.top = "0px";
        winScreen.style.background = (color === "red")? "rgba(255, 0, 0, 0.8)" : "rgba(255, 248, 45, 0.8)";
        winScreen.style.height = canvas.height + "px";
        winScreen.style.width = canvas.width + "px";

        playAgain.addEventListener("click", function(){
            //Pushing it way off screen so we don't have to worry about accidentally clicking anything. Not my proudest solution.
            winScreen.style.top = "-750px";
            winScreen.style.background = "rgba(255,255,255, 0)";
            winScreen.style.height = 0 + "%";
            //resetting the board
            chipArray = [];
            columnList = {};
            lineCoordsX = [];
            lineCoordsY = [];
            color = "red";
            c.clearRect(0,0, canvas.width, canvas.height);
            drawGrid();
        })
    }
    
    canvas.addEventListener("click", function(e){
        //Getting where the chip will be placed
        chipPosition(e);
        //Placing the chip
        chipCheck();
        
    })
    
    //"Main"
    drawGrid()
}