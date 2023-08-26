const Players = require('../schemas/users');
const RoomInfo = require('../schemas/roominfo.js');
const Dealercard = require('../schemas/dealercard.js');
const dbconn = require('../schemas/dbconn.js');
const mongoose = require('mongoose');

module.exports = class MongoAccess {

  constructor() {

  }
  connect() {
    dbconn();
  }

  createRoom(roomid) {
    let roomInfo = new RoomInfo();
    roomInfo.room_id = roomid;

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

  roomDataUpdate(roomid, keyName, setValue) {
    let retCode = 0;
    let updateStr = {};

    let indexStr = keyName;
    updateStr[indexStr] = setValue;
    //updateStr. = arrayStr;

    console.log(updateStr);

    // 지정 어레이 인덱스의 요소값 변경
    RoomInfo.findOneAndUpdate(
      { room_id: roomid },
      updateStr,
      {
        upsert: true,
        returnOriginal: false,
      }
    ).then((resData) => {
      console.log('room data update success');
      console.log(resData);

      retCode = 0;
    }
    ).catch((err) => {
      console.log(err);
      retCode = 1;
    })

    return retCode;

  }
  /**
   * 
   * @param {string} roomid 룸아이디
   * @param {string} keyName 룸객체내의 변수 이름
   * @param {number} nindex  
   * @param {any} setValue 설정값
   * @returns 
   */
  roomArrayUpdate(roomid, keyName, nindex, setValue) {
    let retCode = 0;
    let updateStr = {};
    let arrayStr = {};

    if (nindex == -1) {
      // 지정 배열 전체 값  변경 
      let indexStr = keyName + ".$[]";
      arrayStr[indexStr] = setValue;
      updateStr.$set = arrayStr;

      RoomInfo.findOneAndUpdate(
        { room_id: roomid },
        updateStr,
        {
          upsert: true,
          returnOriginal: false,
        }
      ).then((resData) => {
        console.log('player all data change success');
        console.log(resData);
        retCode = 0;
      }
      ).catch((err) => {
        console.log(err);
        retCode = 1;
      })
    } else {
      let indexStr = keyName + '.' + nindex;
      arrayStr[indexStr] = setValue;
      updateStr.$set = arrayStr;

      // 지정 어레이 인덱스의 요소값 변경
      RoomInfo.findOneAndUpdate(
        { room_id: roomid },
        updateStr,
        {
          upsert: true,
          returnOriginal: false,
        }
      ).then((resData) => {
        console.log('player element change success');
        console.log(resData);

        retCode = 0;
      }
      ).catch((err) => {
        console.log(err);
        retCode = 1;
      })
    }
    return retCode;
  }

  roomArrayPush(roomid, keyName, setValue) {
    let retCode = 0;
    let updateStr = {};
    let arrayStr = {};

    arrayStr[keyName] = setValue;
    updateStr.$push = arrayStr;
    // 지정 어레이 인덱스의 요소값 변경
    RoomInfo.findOneAndUpdate(
      { room_id: roomid },
      updateStr,
      {
        upsert: true,
        returnOriginal: false,
      }
    ).then((resData) => {
      console.log('array push success');
      console.log(resData);

      retCode = 0;
    }
    ).catch((err) => {
      console.log(err);
      retCode = 1;
    })

    return retCode;
  }

  roomArrayReset(roomid, keyName) {
    let retCode = 0;
    let updateStr = {};
    let arrayStr = {};

    arrayStr[keyName] = [];
    updateStr.$set = arrayStr;
    // 지정 어레이 인덱스의 요소값 변경
    RoomInfo.findOneAndUpdate(
      { room_id: roomid },
      updateStr,
      {
        upsert: true,
        returnOriginal: false,
      }
    ).then((resData) => {
      console.log('array push success');
      console.log(resData);

      retCode = 0;
    }
    ).catch((err) => {
      console.log(err);
      retCode = 1;
    })

    return retCode;
  }

  joinRoom(roomid, playerid) {
    let retCode = 0;
    // NONE 인 첫번째 어레이 데이터에 유저 등록

    RoomInfo.updateOne({ room_id: roomid, player: "NONE" }, { $set: { "player.$": playerid } })
      .then((resData) => {
        console.log(resData);

        retCode = 1;

      }).catch((err) => {
        console.log(err);
        retCode = 0;
      })


    /*
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
      })*/
    return retCode;
  }
  /**
   * retcode : 0 success,1 passwd fail,2 used id,3 id not exist
   * @param {*} userid 
   * @param {*} passwd 
   */
  loginUser(userid, passwd) {
    let retCode = 0;

    Players.find({ user_id: userid }) // user id exist ?
      .then((user) => {
        console.log("find user:" + user[0].user_id)
        //console.log(user);
        //res.json({ message: 'find user:' + user[0].user_id })
        if (user[0].loginedUser == false) {
          if (user[0].user_id == userid && user[0].password != passwd) {
            retCode = 1; // 비밀번호 틀림.
          }
        } else {
          retCode = 2; // 아이디 사용중
        }
      }).catch((err) => {
        console.log('login fail....')

        retCode = 3; // 아이디 없음
      })
  }

} // class mongoaccess

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
