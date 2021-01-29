// TODO: generate grid coordinates based on neighbour tiles
// Every tile is one space on the grid, calculate coordinates accordingly
import { v4 as uuid } from 'uuid';

export default class Tile {
  constructor(specialFunction, color, xDist, yDist, isMainBranch, tileType = 'path') {
    this.uuid = uuid();
    this.nextTiles = [];
    this.previousTiles = [];
    this.players = [];
    this.specialFunction = specialFunction;
    this.color = color;

    this.xDist = xDist;
    this.yDist = yDist;
    this.main = isMainBranch;
    this.type = tileType;
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

  tileUpdate(players) {
    this.players = players.filter(p => {
      return p.currentTile.uuid === this.uuid;
    });
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