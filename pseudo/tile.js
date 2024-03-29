// TODO: generate grid coordinates based on neighbour tiles
// Every tile is one space on the grid, calculate coordinates accordingly
class Tile {
	constructor(specialFunction, color, xDist, yDist) {
		this.nextTiles = [];
		this.previousTiles = [];
		this.players = [];
		this.specialFunction = specialFunction;
		this.color = color;
		
		this.xDist = xDist;
		this.yDist = yDist;
	}
	
	isJunction() {
		return this.nextTiles.length > 1;
	}
	
	isStartTile() {
		return this.previousTiles.length < 1;
	}
	
	isEndTile() {
		return this.nextTiles.length < 1;
	}
	
	tileUpdate() {
		this.infectionFunction();
		this.insanityFunction();
		if (this.specialFunction != null) this.specialFunction();
	}
	
	infectionFunction() {
		if (this.players.length > 1) {
			for(let i = 0; i < this.players.length; i++) {
				this.players[i].infection++;
			}
		}
	}
	
	insanityFunction() {
		if (this.players.length > 1) {
			for(let i = 0; i < this.players.length; i++) {
				this.players[i].insanity++;
			}
		}
	}
}