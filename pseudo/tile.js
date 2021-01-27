class Tile {
	constructor(specialFunction) {
		this.nextTiles = [];
		this.previousTiles = [];
		this.players = [];
		this.specialFunction = specialFunction;
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