const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const RoomInfoSchema = new Schema({
  room_id: {
    required: true,
    unique: true,
    type: String,
  },
  players: {
    required: true,
    type: [String],
  },
  // 0 noaction 
  // 1 wait player response
  // 2 complete player response 
  playersResponse: {
    required: true,
    type: [Number],
  },
  // 0: game ready  0< status : playing game 
  // 1: pre flop
  // 2: betting
  // 3: turn
  // 4: river
  // 5: final i
  gameStatus: {
    type: Number,
    max: 100,
    min: 0,
    default: 0,
  },
  //current betting players index value 
  bettingPlayer: {
    type: Number,
    max: 100,
    min: 0,
    defalut: 0,
  },
  // 0 : thinking
  // 1 : call
  // 2 : raise
  // 3 : check
  // 4 : drop
  bettingPlayerStatus: {
    type: Number,
    max: 20,
    min: 0,
    defalut: 0,
  },
  //deck betting money total sum
  deckBettingAmt: {
    type: Number,
    defalut: 0,
  },
  //previous betting amt 
  prevBettingAmt: {
    type: Number,
    defalut: 0,
  },
  //holdem dealer button player index
  dealerButton: {
    type: Number,
    defalut: 0,
  },
  cardPopIndex: {
    type: Number,
    defalut: 0,
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
