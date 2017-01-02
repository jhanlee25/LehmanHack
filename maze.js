var canvas = document.getElementById("BOARD"),ctx = canvas.getContext('2d');
var HRATIO = canvas.height/H, WRATIO = canvas.width/W;
var timeperturn = 10;
var delaytimer = 500;
// print inventory

var images = {};
function drawImage(imageurl,xy,size) {
	if (size === undefined) size = 1;
	var x = xy[0]*WRATIO,y = xy[1]*HRATIO;
	
	if (images[imageurl] === undefined) {
		var im = new Image();
		im.onload = function(){ ctx.drawImage(this,x,y,WRATIO*size,HRATIO*size); };
		im.src = imageurl;
		images[imageurl] = im;
	} else {
		ctx.drawImage(images[imageurl],x,y,WRATIO*size,HRATIO*size);
	}
}

function drawLine(p1,p2) {
	ctx.beginPath();
	//ctx.lineWidth = width;
	ctx.moveTo(p1[0],p1[1]);
	ctx.lineTo(p2[0],p2[1]);
	ctx.stroke();
}
var drawBoard = function drawBoard() {
	ctx.fillStyle = 'white';
	ctx.fillRect(0,0,canvas.width,canvas.height);
	for (var i=0;i<W;i++) drawLine([0,i*HRATIO],[canvas.width,i*HRATIO]);
	for (var i=0;i<H;i++) drawLine([i*WRATIO,0],[i*WRATIO,canvas.height]);
	if (CHEESEOWNER < 0)
		drawImage("images/cheese.png",CHEESE,.25);
};
var drawPlayers = function drawPlayers() {
	drawImage("images/mouse1.png",PLAYER1);
	drawImage("images/mouse2.png",PLAYER2);
	if (!CollisionBetween(PLAYER1,HOUSE1))
		drawImage("images/house1.png",HOUSE1);
	if (!CollisionBetween(PLAYER2,HOUSE2))
		drawImage("images/house2.png",HOUSE2);
	var x=PLAYERS[turn][0]*WRATIO+WRATIO/2,
		y=PLAYERS[turn][1]*HRATIO+HRATIO/2;
	ctx.moveTo(x,y);
	ctx.arc(x,y,Math.min(WRATIO,HRATIO)/2,0,7);
	ctx.stroke();
};

var title = "";
var text = ""
var drawText = function drawText() {
	if (text) {
		ctx.fillStyle = "rgba(0, 0, 0, .7)";
		ctx.fillRect(100,100,canvas.width-200,canvas.height-200);
		ctx.strokeStyle = "white";
		ctx.font = "20px sans-serif";
		ctx.strokeText(text,100,100+20,canvas.width-200);
	}	
	if (title) {
		ctx.fillStyle = "rgba(100, 100, 100, .7)";
		ctx.fillRect(100,50,canvas.width-200,50);
		
		ctx.strokeStyle = "black";
		ctx.font = "40px sans-serif";
		ctx.strokeText(title,100,100-20,canvas.width-200);
	}
	
};

var timestart = 0;
var drawTimer = function drawTimer() {
	if (timestart === 0) return;
	ctx.font = HRATIO/2 + "px sans-serif";
	var dispnum = Math.round(timestart - Date.now()/1e3,2);
	if (dispnum < 0) {
		switchPlayers();
		timestart = 0;
	} else {
		ctx.strokeText(dispnum, canvas.width-WRATIO/2,HRATIO/2,WRATIO/2);
	}
};
var resetTimer = function resetTimer(){
	timestart = Date.now()/1e3 + timeperturn;
}

var clean = function clean() {
	text = "";
	title = "";
};
var cantype= true;
var switchPlayers = function switchPlayers() {
	turn = flipturn();
	cantype= false;
	setTimeout(function() {cantype=true;clean();},delaytimer);
}

var draw = function draw() {
	drawBoard();
	drawPlayers();
	drawText();
	drawTimer();
	window.requestAnimationFrame(draw);
};

var moveregex = /player.move.{2,5}(?=\(\))/;
var cheeseregex = /player.checkForCheese()/;
var submit = function submit() {
	var savetext = text;
	text = "";
	title = "";

	var match;;
	if (match = moveregex.exec(savetext)) {
		var dir = match[0].replace(/^player.move/,'');
		switch(dir) {
			case "Up":    MOVE(PLAYERS[turn],UP);   break;
			case "Down":  MOVE(PLAYERS[turn],DOWN); break;
			case "Left":  MOVE(PLAYERS[turn],LEFT); break;
			case "Right": MOVE(PLAYERS[turn],RIGHT);break;
			default: title = "No function move"+dir+"()"; return;
		}
		if (levels[turn][0] < 3) levels[turn][0]++;
	} else if (match = cheeseregex.exec(savetext)) {
		PICKUPCHEESE();
		if (CHEESEOWNER < 0) {
			levels[turn][0]=4;
			title = "No Cheese found :c";
		} else {
			title = "You Found Cheese!!";
			levels[turn][0]=5;
		}
	} else {
		title = "SyntaxError !!";
	}
}

draw();

var ranges = [["A".charCodeAt(0),"Z".charCodeAt(0)],["a".charCodeAt(0),"z".charCodeAt(0)],["0".charCodeAt(0),"9".charCodeAt(0)]]
var compre = "-=+*/;.";
var levels = [
[1,"type: player.moveDown(); and click enter","type: player.moveRight(); and click enter","type: player.checkForCheese(); and click enter","move and check for cheese","get home"],
[1,"type: player.moveUp(); and click enter","type: player.moveLeft(); and click enter","type: player.checkForCheese(); and click enter","move and check for cheese","get home"],
]
document.onkeydown = canvas.onkeydown = function(event){
	if (!cantype) return;
	if (timestart === 0) resetTimer();
	title =  levels[turn][levels[turn][0]];
	event.preventDefault();
	for (var i=0;i<ranges.length;i++) {
		if (ranges[i][0] <= event.keyCode && event.keyCode <= ranges[i][1])
			return text += event.key;
	}	
	for (var i=0; i<compre.length; i++) {
		if (event.key === compre.charAt(i))
			return text += event.key;
	}
	switch (event.keyCode) {
		case 8: // backspace
		text = text.slice(0,-1);
		if (!text) title = "";
		return 
		case 13: // enter/return
		return submit();
	}
	console.log(event);
}