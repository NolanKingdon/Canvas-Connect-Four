window.onload = function() {
    
    var canvas = document.querySelector("canvas");
    //My browser seems to not want to fit to screen - adds scroll bars. This is a temp. Workaround
    var innerHeight = window.innerHeight-6;
    var innerWidth = window.innerWidth-6;
    var c = canvas.getContext("2d");
    var boardHeight = Math.ceil(innerHeight/6);
    var boardWidth = Math.ceil(innerWidth/7);
    var lineCoordsX = []
    var lineCoordsY = []
    var newCoords = [
        x = undefined,
        y = undefined
    ];
    var chipArray = [];
    //start color
    var color = "red";
    var columnList = {}
        
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    function Chip(x,y,color, rad){
        this.x = x;
        this.y = y;
        this.color = color;
        //I'd like rad to be derrived from the screen size as well -- Will add later
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
        for(var i = 0; i<7; i++) {
            c.moveTo(0, boardHeight*i);
            c.lineTo(innerWidth, boardHeight*i);
            c.stroke();
            lineCoordsY.push(boardHeight*i);
        }
        for(var i = 0; i<8; i++) {
            c.moveTo(boardWidth*i, 0);
            c.lineTo(boardWidth*i, innerHeight);
            c.stroke();
            lineCoordsX.push(boardWidth*i);
        }
        for(var i = 0; i<lineCoordsX.length; i++) {
            if(i!=lineCoordsX.length-1){
                columnList [(lineCoordsX[i]+lineCoordsX[i+1])/2] = 0;
            }
        }
    }   
    
    canvas.addEventListener("click", function(e){
        var xCount = 0;
        //Centering the Chips
        while(true){
            //If the coords are larger than the line, we're not interested.
            if(e.x > lineCoordsX[xCount]){
                xCount ++;
            //Checking for our far right line
            } else if (e.x < lineCoordsX[xCount]){
                //Centering the click
                newCoords.x = (lineCoordsX[xCount] + lineCoordsX[xCount-1])/2;
                break;
            }
        }
        var yCount = 0;
        while(true){
            if(e.y > lineCoordsY[yCount]){
                yCount++;
            } else if(e.y < lineCoordsY[yCount]){
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
        if(color == "red") {
            chipArray.push(new Chip(newCoords.x, newCoords.y, "red", 40))
            chipArray[chipArray.length-1].create();
            winChecker(chipArray[chipArray.length-1], "right");
            winChecker(chipArray[chipArray.length-1], "upright");
            winChecker(chipArray[chipArray.length-1], "up");
            winChecker(chipArray[chipArray.length-1], "botright");
            color = "blue";
           } else if(color == "blue"){
            chipArray.push(new Chip(newCoords.x, newCoords.y, "blue", 40))
            chipArray[chipArray.length-1].create();
            winChecker(chipArray[chipArray.length-1], "right");
            winChecker(chipArray[chipArray.length-1], "upright");
            winChecker(chipArray[chipArray.length-1], "up");
            winChecker(chipArray[chipArray.length-1], "botright");
            color = "red";
        }
    })
    //determining our directions
    function winChecker(chip, dir) {    
        let fwdCount = 0;
        let bckCount = 0;
    
        //I could probably compact this a bit by having it return pre-defined results based on the dir input, but for now I'm just going to focus on getting it working.
    
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
                            console.log("win");
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
                            console.log("win");
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
                            console.log("win");
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
                            console.log("win");
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
                            console.log("win");
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
                            console.log("win");
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
                            console.log("win");
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
        
        //Probably going to clear the board and put an element on the screen saying that a win has happened, and give options to play again/typical game interface.
        console.log("winner: " + color);
    }
    //"Main"
    drawGrid()
}


