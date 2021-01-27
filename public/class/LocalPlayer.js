import Player from './Player';

export default class LocalPlayer extends Player {
  constructor(name, id, connection, local) {
    super(name, id);
    this.connection = connection;
    this.local = local;
    this.cards = [];
    this.card = null;

    this.money = 100;
    this.items = [
      {name: 'mondkapje', icon: 'face_mask', amount: 0, price: 10, buyable: true, actions: [['current', 'infection', -10]]},
      {name: 'desinfectiegel', icon: 'sanitizer', amount: 0, price: 10, buyable: true, actions: [['', '', 1]]},
      {name: 'toiletpapier', icon: 'toilet_paper', amount: 0, price: 10, buyable: true, actions: [['', '', 1]]},
      {name: 'treinkaartje', icon: 'train_ticket', amount: 0, price: 10, buyable: false, actions: [['', '', 1]]},
      {name: 'vaccin', icon: 'vaccine', amount: 0, price: 10, buyable: false, actions: [['', '', 1]]},
      //{name: '', icon: '', amount: 0, price: 10, buyable: true, actions: [['', '', 1]]},
    ];
  }

  earn(amount) {
    this.money += amount;
  }

  gift(amount, item) {
    this.items.find(itm => {
      return itm.name === item;
    }).amount += amount;
  }

  buy(amount, item) {
    if(this.money - (amount*item.price) >= 0) {
      this.money -= (amount*item.price);
      this.gift(amount, item.name);
    } else {
      this.sendMessage('insufficientFunds').then(r => {
        console.log(r);
      });
    }
  }

  useItem(item) {
    let itm = this.items.find(itm => {
      return itm.name === item;
    });

    if(itm.amount > 0) {
      for(let i = 0; i < itm.actions.length; i++) {
        this.handleAction(itm.actions[i]);
      }
      itm.amount--;
    }
  }

  handleAction(action) {
    if(action[1] === 'infection') {
      this.increaseInfection(Number(action[2]));
    } else if(action[1] === 'insanity') {
      this.increaseInsanity(Number(action[2]));
    } else if(action[1] === 'move') {
      this.move(Number(action[2]));
    } else if(action[1] === 'money') {
      this.earn(Number(action[2]));
    } else if(action[1] === 'item') {
      this.gift(Number(action[2]), action[3]);
    }
  }

  async sendMessage(messageType, data) {
    //this.connection.send(messageType, data);
    /*
    Events:
    - startGame
    - chooseCard {response->type: [pickedCard, ...]}
    - rollDice
    - chooseNextTile
    - playerFinished

    - giveCard
    - useCard

    -
     */
    this.local.$emit(messageType, data);

    return this.local.$on('resumeBackend', res => {
      return res;
    });
  }
}