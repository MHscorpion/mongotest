const Players = require('../schemas/users');
const RoomInfo = require('../schemas/roominfo.js');
const Dealercard = require('../schemas/dealercard.js');

const mongoose = require('mongoose');

module.exports = class MongoAccess {

  constructor() {

  }

  createRoom(roomid) {
    let roomInfo = new RoomInfo();
    roomInfo.room_id = roomid;
    roomInfo.players = [];
    roomInfo.playersResponse = [];
    roomInfo.gameStatus = 0;
    roomInfo.bettingPlayer = 0;
    roomInfo.bettingPlayerStatus = 0;
    roomInfo.deckBettingAmt = 0;
    roomInfo.prevBettingAmt = 0;
    roomInfo.dealerButton = 0;
    roomInfo.cardPopIndex = 0;
    roomInfo.deckCards = [];

    let retValue = 0;
    RoomInfo.insertMany(roomInfo)
      .then((resData) => {
        console.log('Room create success...');
      }).catch((err) => {

        //console.log('Room add error');
        console.log('room create error');
        retValue = 1;
      })

    let newCardDeck = new Dealercard();
    newCardDeck.room_id = roomid;
    newCardDeck.cards = createPokerArray();

    Dealercard.insertMany(newCardDeck)
      .then((cards) => {
        //console.log(cards);
        //res.json({ message: 'deckcard create success...' })
        console.log('deckcard create success...');

      }).catch((err) => {

        //console.log('dd eckcaradd error');
        console.log('deckcaradd error');
        retValue = 2;
      })


    return retValue;
  }

  joinRoom(roomid, playerid) {
    let retCode = 0;
    Players.find({ user_id: playerid }) // user id exist ?
      .then((user) => {
        console.log("find user:" + user[0].user_id)
        //console.log(user);
        //res.json({ message: 'find user:' + user[0].user_id })
        RoomInfo.findOneAndUpdate(
          { room_id: roomid },
          { $push: { players: playerid, playersResponse: 0 } },
        ).then((resData) => {
          console.log('join room success');
          retCode = 0;
        }

        ).catch((err) => {

          console.log('find room error ')
          retCode = 1;
        })

      }).catch((err) => {
        console.log('joinroom error ')

        retCode = 2;
      })
    return retCode;
  }
} // class 

function createPokerArray() {
  let pokerNum = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
  let pokerShape = ['S', 'D', 'H', 'C'];
  let pokerCard = new Array();
  for (let i = 0; i < pokerShape.length; i++) {
    for (let j = 0; j < pokerNum.length; j++) {
      pokerCard.push(pokerShape[i] + pokerNum[j]);
    }
  }
  shuffle(pokerCard);
  shuffle(pokerCard);
  shuffle(pokerCard);
  /*
  let cardMap = new Map();
 
  // set으로 맵 객체에 삽입
  for (let i = 0; i < pokerCard.length; i++) {
    cardMap.set(i, pokerCard[i]);
  }
  */
  //console.log(pokerCard);
  return pokerCard;
  /*
    for (let i = 0; i < pokerCard.length; i++) {
      console.log(cardMap.get(i));
    */
  //console.log(cardMap);
}

function shuffle(array) {
  for (let index = array.length - 1; index > 0; index--) {
    // 무작위 index 값을 만든다. (0 이상의 배열 길이 값)
    const randomPosition = Math.floor(Math.random() * (index + 1));

    // 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다.
    const temporary = array[index];
    array[index] = array[randomPosition];
    array[randomPosition] = temporary;
  }
}
