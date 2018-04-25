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
    var clickCoords = [
        x = undefined,
        y = undefined
    ];
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
        console.log(columnList);
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
        //Checking color
        //Need to now check: 
            //If anything is in the bottom of the column
            //If anything is in the column clicked
        //Going to re-do this with a column JSON formatter to be more efficient in the future. Right now, I'm using it to determine if the chip goes to the bottom and keeping my old messy/ineffiecient code.
        if(columnList [newCoords.x] == 0){
            newCoords.y = (lineCoordsY[lineCoordsY.length-1] + lineCoordsY[lineCoordsY.length-2])/2
            columnList [newCoords.x] +=1;
        } else {
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
            columnList [newCoords.x] +=1;
        }
        if(color == "red") {
            chipArray.push(new Chip(newCoords.x, newCoords.y, "red", 40))
            chipArray[chipArray.length-1].create();
            color = "blue";
           } else if(color == "blue"){
            chipArray.push(new Chip(newCoords.x, newCoords.y, "blue", 40))
            chipArray[chipArray.length-1].create();
            color = "red";
        }
    })
    
    function winChecker() {
        
    }
    //"Main"
    drawGrid()
}


