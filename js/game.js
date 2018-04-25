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
    
    console.log(boardHeight, " ", boardWidth);
    
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
    
    //"Main"
    drawGrid()  
    
    
}


