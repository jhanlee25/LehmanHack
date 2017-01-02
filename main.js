var PLAYER1,PLAYER2,PLAYERS = [PLAYER1 = [0, 0],PLAYER2=[4,4]];
var HOUSE1,HOUSE2,HOUSES=[HOUSE1=PLAYER1.slice(),HOUSE2=PLAYER2.slice()];
// pick up items by indexing
//var INVENTORY1, INVENTORY2, INVENTORY = [INVENTORY1 = ["red", "blue", "green", "yellow"], INVENTORY2 =["green", "red", "yellow", "blue"]];
//var EQUIP1, EQUIP2, EQUIP = [EQUIP1 = ["empty"], EQUIP2 = ["empty"]];
//var colors = ["red", "blue", "green", "yellow"];
//var DOOR = {
// 	position: [3,2],
// 	color: colors[Math.floor(Math.random()*3)],
// 	open: false
// };
var CHEESEOWNER = -1;
var W=5, H=5;
var CHEESE = [1+Math.floor(Math.random()*3), 1+Math.floor(Math.random()*3)];
var UP, DOWN, LEFT, RIGHT;
var directions = [RIGHT = [1,0], LEFT = [-1,0], DOWN = [0,1], UP = [0,-1]];
var turn = 0;

var gamestart = function gamestart() {
	console.log("Find the hidden cheese in the maze before the other player!");
	console.log("Type MOVE(player, direction) to move your character");
	console.log("Type PICKUPCHEESE() to pick up the cheese")
	//console.log("Type SHOWINVENTORY() to see your inventory")
}

function PLAYERTURN(direction) {
	MOVE(PLAYERS[turn], direction)
	console.log("Player " + (turn + 1) + " moved to " +  PLAYERS[turn])	//changeplayerturn()
	//if (CollisionBetween(PLAYERS[turn], DOOR.position) && (DOOR.open ==false)) {
		//console.log("Player " + turn + " is blocked by a closed " + DOOR.color + " door")
		//console.log("USE(INVENTORY[], DOOR.color) the inventory slot containing the matching key to pass through")
		//Need to prompt player for key, otherwise player must move back to original square
		//MOVE(PLAYERS[turn], direction, true)
		//return
	//}
	if (CollisionBetween(PLAYERS[turn],CHEESE))
		console.log("Player " + (turn + 1) +" found the cheese!");
	if (GotHomeWithCheese()) {
		console.log("Player " + (turn + 1) + " got home with the cheese!")
		console.log("Player " + (turn + 1) + " is the winner!")
		return
	}
	turn = flipturn();
	console.log("It is now Player " + (turn + 1) + "'s turn" )
}

var flipturn = function flipturn() {
	return turn?0:1;
};

function MOVE(PLAYER, direction, backwards) {
	if (backwards) {
		// happens directly since only we should use it internally
		PLAYER[0] -= direction[0];
		PLAYER[1] -= direction[1];
	} else {
		var TESTPLAYER = [PLAYER[0] + direction[0],PLAYER[1] + direction[1]];
		// check between new position and other player
		if (CollisionBetween(TESTPLAYER,PLAYERS[flipturn()])) {
			console.log("Cannot move there, space is occupied");
		} else if (TESTPLAYER[0] < 0 || TESTPLAYER[0] > 4 || TESTPLAYER[1] < 0 || TESTPLAYER[1] > 4) {
			console.log("Cannot move there, out of bounds");
		} else {
			PLAYER[0] = TESTPLAYER[0];
			PLAYER[1] = TESTPLAYER[1];
		}
	}
	console.log(PLAYER);
}

function PICKUPCHEESE() {
	if (CollisionBetween(PLAYERS[turn],CHEESE)) {
		CHEESEOWNER = turn
		console.log("Player " + (turn + 1) + " has picked up the cheese!")
		console.log("Player " + (turn +1) + " wins if they return home with the cheese!")
		console.log("Player " + (turn?2:1 + 1) + " must tag Player " + (turn + 1) + " to make them drop the cheese")
	} else {
		console.log("Player " + (turn +1) + " did not find the cheese")
	}
}

function GotHomeWithCheese() {
	return (CollisionBetween(PLAYERS[turn],HOUSES[turn])) && (turn == CHEESEOWNER);
}

function CollisionBetween(OB1,OB2) {
	return (OB1[0] == OB2[0]) && (OB1[1] == OB2[1]);
} 

//function SHOWINVENTORY(){
		//console.log("Player " + (turn + 1) + "'s inventory has: ");
		//console.log(INVENTORY[turn]);
		//if (PLAYERS[turn] == CHEESEOWNER){
			//console.log("Player " + (turn +1) + " has the cheese")
		//}
//}

gamestart();