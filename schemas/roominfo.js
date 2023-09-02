const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const RoomInfoSchema = new Schema({
  room_id: {
    required: true,
    unique: true,
    type: String,
  },
  gameStep: {
    type: Number,
    default: 0,
  },
  dealerButton: {
    type: Number,
    default: 0,
  },
  actionPlayer: {
    type: Number,
    default: 0,
  },
  bettingPlayerIndex: {
    type: Number,
    default: 0,
  },
  requestResponse: {
    type: Boolean,
    default: false,
  },
  player: {
    type: [String],
    default: ["NONE", "NONE", "NONE", "NONE", "NONE", "NONE", "NONE"],
  },
  bettingOrder: {
    type: [Number],
    default: [0, 1, 2, 3, 4, 5, 6],
  },
  // 0 noaction 
  // 1 wait player response
  // 2 complete player response 
  playerStatus: {
    type: [Number],
    default: [0, 0, 0, 0, 0, 0, 0],
  },
  playerRefresh: {
    type: [Number],
    default: [0, 0, 0, 0, 0, 0, 0],
  },
  playerAction: {
    type: [Number],
    default: [0, 0, 0, 0, 0, 0, 0],
  },
  playerBettingMoney: {
    type: [Number],
    default: [0, 0, 0, 0, 0, 0, 0],
  },
  playerMoney: {
    type: [Number],
    default: [0, 0, 0, 0, 0, 0, 0],
  },
  playerCard: {
    type: [String],
    default: ["", "", "", "", "", "", ""],
  },

  //deck에 깔린 카드
  deckCards: {
    required: true,
    type: [String],
  },
  modDate: {
    type: Date,
    default: Date.now(),
  }

});

module.exports = mongoose.model('RoomInfo', RoomInfoSchema);
