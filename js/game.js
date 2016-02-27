// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

var rockReady = false;
var rockImage = new Image();
rockImage.onload = function () {
	rockReady = true;
};
rockImage.src = "images/stone.png";

var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

//level's game
var level = 1;
//variables for the movement of the monster
var random  = Math.random();
var initPosMonster = {right:true,left:false,up:true,down:false};

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var princess = {};
var princessesCaught = 0;

//object Rock and an array where to storage them
var rocks = [];

Rock = function(x,y){
	this.x = x;
	this.y = y;
};


var monster = {
	monsterSpeed: 50,
	mx : 200,
	my : 200,
};

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	console.log(e.keyCode);
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);


//funcion para calcular la posicion de la roca
function rockCoords(px,py){

	var x = 32 + (Math.random() * (canvas.width - 100));
	var y = 32 + (Math.random() * (canvas.width - 100));
	var pos = {};

	if((x >= px+20 || x <= px-20) && (y >= py+20 || y <= py-20) && (x !== canvas.width/2 && y !== canvas.height/2)){
		pos.x = x;
		pos.y = y;
		
	}else{
		pos.x = 32 + (Math.random() * (canvas.width - 100));
		pos.y = 32 + (Math.random() * (canvas.width - 100));
	}

	return pos;

};
// Reset the game when the player catches a princess
var reset = function () {

	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the princess somewhere on the screen randomly
	princess.x = 32 + (Math.random() * (canvas.width - 100));//modificado a -100 para evitar que la pricesa aparezca en los arboles
	princess.y = 32 + (Math.random() * (canvas.height - 100));//modificado a -100 para evitar que la pricesa aparezca en los arboles

	//create a rock pos
	for(var i=0;i<level;i++){
		var pos = rockCoords(princess.x,princess.y);
		var rock = new Rock(pos.x,pos.y);
		rocks[i] = rock;
	}

	//create monster position
	monster.mx = princess.x+30;
	monster.my = princess.y+30;
	initPosMonster.x = monster.mx;
	initPosMonster.y = monster.my;
};

// Update game objects
var update = function (modifier) {
	
	if (random < 0.5){//si es menor de 0.5 se mueve de derecha a izquierda
		if(initPosMonster.right && parseInt(monster.mx) !== canvas.width-46){
			monster.mx += monster.monsterSpeed*modifier;
		}
		if(parseInt(monster.mx) === canvas.width-46){
			initPosMonster.right = false;
			initPosMonster.left = true;
		}
		if(initPosMonster.left && parseInt(monster.mx) !== 26){
			monster.mx -= monster.monsterSpeed*modifier;
		}
		if(parseInt(monster.mx) === 26){
			initPosMonster.right = true;
			initPosMonster.left = false;
		}

	}else{// si es 0.5 o mas se mueve de arriba a abajo
		if(initPosMonster.up && parseInt(monster.my) !== canvas.height-46){
			monster.my += monster.monsterSpeed*modifier;
		}
		if(parseInt(monster.my) === canvas.height-46){
			initPosMonster.up = false;
			initPosMonster.down = true;
		}
		if(initPosMonster.down && parseInt(monster.my) !== 26){
			monster.my -= monster.monsterSpeed*modifier;
		}
		if(parseInt(monster.my) === 26){
			initPosMonster.up = true;
			initPosMonster.down = false;
		}
	}

	if (38 in keysDown) { // Player holding up

		if(hero.y > 20){

			hero.y -= hero.speed * modifier;
		}
	}
	if (40 in keysDown) { // Player holding down
		if(hero.y < (canvas.height-60)){
			hero.y += hero.speed * modifier;
		}
	}
	if (37 in keysDown) { // Player holding left
		if(hero.x > 20){
			hero.x -= hero.speed * modifier;
		}
	}
	if (39 in keysDown) { // Player holding right
		if(hero.x < (canvas.width-60)){
			hero.x += hero.speed * modifier;
		}
	}

	// Are they touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;

		var nextLevel = parseInt(princessesCaught/10);

		if(nextLevel === 1 && level < 2){
			++level;
			monster.monsterSpeed+=10;
		}else if (nextLevel > 1 && nextLevel === level){
			++level;
			monster.monsterSpeed+=10;
		}
		random  = Math.random();
		reset();

	}

	if (
		hero.x <= (monster.mx + 16)
		&& monster.mx <= (hero.x + 16)
		&& hero.y <= (monster.my + 16)
		&& monster.my <= (hero.y + 32)
	) {
		random  = Math.random();
		reset();
	}

};

// Draw everything
var render = function (modifier) {

	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	if (rockReady){
		for(var i=0;i<rocks.length;i++){
			ctx.drawImage(rockImage, rocks[i].x, rocks[i].y);
		}
	}

	if (monsterReady){
		
		ctx.drawImage(monsterImage, monster.mx, monster.my);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();
	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
