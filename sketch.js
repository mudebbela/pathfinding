function removeFromArray(arr, elt){
  for (i = arr.length; i>=0; i--){
    if(arr[i] === elt){
      arr.splice(i,1);
    }
  }
}

function heuristic(a, b){
  var d = dist(a.i, a.j, b.i, b.j);
  return d;
}
var cols = 100;
var rows = 100;
var grid =  new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;
var w, h;
var path =[];

//changeable variable,
//hopefully obvious

//can we step diagonally
var diagonals =true;

//add or remove walls (for debugging)
var hasWalls = true;

//how often well have hasWalls
var wallChance = .4;

//see open or closed set blocks (debuggin and aesthetics)
var showOpenSet = true;
var showClosedSet = true;


function Spot(i,j){

  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbours = [];
  this.previous = undefined;
  this.wall = false;

  if (hasWalls){
    if(random(1)< wallChance){
      this.wall = true;
    }
  }

  this.show = function(col){
    fill(col);
    if(this.wall){
      fill(0);
    }
    noStroke();
    rect(this.i*w, this.j*h, w-1, h-1);
  }

this.addNeighbours = function(grid){
  var i = this.i;
  var j = this.j;

  if(diagonals){
    if(j< rows - 1 && i < cols - 1){
      this.neighbours.push(grid[i+1][j+1]);
    }
    if(j> 0&& i>0){
      this.neighbours.push(grid[i-1][j-1]);
    }

    if(i>0 && j< rows - 1){
      this.neighbours.push(grid[i-1][j+1]);
    }

    if(i<cols - 1 &&  j> 0){
      this.neighbours.push(grid[i+1][j-1]);
    }
  }
  if(i< cols - 1){
    this.neighbours.push(grid[i+1][j]);

  }
  if(i>0){
    this.neighbours.push(grid[i-1][j]);

  }
  if(j<rows - 1){
    this.neighbours.push(grid[i][j+1]);

  }
  if(j > 0 ){
    this.neighbours.push(grid[i][j-1]);


  }
}

}


function setup(){

  //openSet = [];
  //closedSet = [];
  createCanvas(400, 400);
  console.log('A');

  w = width/ cols;
  h = height/ rows;

  //make 2D array
  for(var i =  0; i< cols; i++){
  	grid[i] = new Array(rows);
  }

  for(var i = 0; i<cols; i++){
    for(var j = 0; j < rows; j++){
      grid[i][j] = new Spot(i, j);
    }
  }



  for(var i = 0; i<cols; i++){
    for(var j = 0; j < rows; j++){
      grid[i][j].addNeighbours(grid);
    }
  }

  start = grid[0][0];
  end =  grid[cols-1][rows - 1];

  openSet.push(start);
  console.log(openSet);


console.log(grid);
}

function draw(){
  console.log(openSet);
  if(openSet.length > 0){
    //keep going
    var winner = 0;
    for(var i =0; i<openSet.length; i++){
      if(openSet[i].f <= openSet[winner].f){
        winner = i;

      }
    }

    var current = openSet[winner];

    if(current === end){
      console.log("DONE");
      end.show(color(255,255,0));
      noLoop();
    }

    //openSet.remove(current);
    //if only that was a thing right??
    removeFromArray(openSet, current);
    console.log(openSet);
    closedSet.push(current);


    //check neighbours
    var neighbours = current.neighbours;
    for(var i=0; i< neighbours.length; i++){

      var neighbour = neighbours[i];
      if(!closedSet.includes(neighbour) && !neighbour.wall){
        var tempg = current.g+1;
        if(!openSet.includes(neighbour)){
          openSet.push(neighbour);

          neighbour.g = tempg;
          neighbour.h = heuristic(neighbour, end);
          neighbour.f = neighbour.g+ neighbour.h;
          neighbour.previous = current
        } else {
          if(tempg< neighbour.g){
            neighbour.g = tempg;
            neighbour.h = heuristic(neighbour, end);
            neighbour.f = neighbour.g+ neighbour.h;
            neighbour.previous = current
          }
        }
      }

    }
  } else {
    //no solution

    //console.log("Nothin in openSet set.. why??");
 }
  background(0);
  //make the canvas white
  for(var i = 0; i<cols; i++){
    for(var j = 0; j<rows; j++){
      grid[i][j].show(color(255));
    }
  }
  //red out closed nodes
  for(var i  = 0; i< closedSet.length; i++){
    //closedSet[i].show(color(255,0,0));
  }

  //green out open nodes
  for(var i  = 0; i< openSet.length; i++){
    openSet[i].show(color(0,255,0));
  }

  path = [];
  var temp = current;
  while(temp.previous){
    path.push(temp.previous);
    temp = temp.previous;
  }

  //blue out path
  for(var i = 0; i<path.length; i++){
    path[i].show(color(0,0,255));

  }

}
