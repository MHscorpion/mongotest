const Players = require('../schemas/users');
const RoomInfo = require('../schemas/roominfo.js');
const Dealercard = require('../schemas/dealercard.js');
const dbconn = require('../schemas/dbconn.js');
const mongoose = require('mongoose');

module.exports = class MongoAccess {

  constructor() {
    this.popCard = '00';
  }
  mongoConnect() {
    dbconn().then((resCode) => {
      if (resCode == 0) {
        console.log('mongo db connect ok.');
      }
    });
  }

  async createRoom(roomid) {
    let roomInfo = new RoomInfo();
    roomInfo.room_id = roomid;

    let retCode = 0;
    try {
      const resData = await RoomInfo.create(roomInfo);
      if (resData) {
        console.log(`create room data: ${roomid}`);
      } else {
        retCode = 4;
      }

      let newCardDeck = new Dealercard();
      newCardDeck.room_id = roomid;
      newCardDeck.cards = createPokerArray();

      const resData2 = await Dealercard.create(newCardDeck);
      if (resData2) {
        console.log(`create dealercard: ${roomid}`);
      } else {
        retCode = 4;
      }
    } catch (err) {
      retCode = 99;
      console.log('room create err:' + err);
    }

    return retCode;
  }

  async deleteRoom(roomid) {

    let retValue = 0;
    try {
      const resData = await RoomInfo.findOneAndDelete({ 'room_id': roomid });
      if (resData) {
        console.log(`delete room data: ${roomid}`);
      } else {
        retCode = 4;
      }

      const resData2 = await Dealercard.findOneAndDelete({ 'room_id': roomid });
      if (resData2) {
        console.log(`delete dealerCard data: ${roomid}`);
      } else {
        retCode = 4;
      }
    } catch (err) {
      console.log('delete room err:' + err);
      retCode = 99;
    }

    return retValue;
  }

  async roomDataUpdate(roomid, keyName, setValue) {
    let retCode = 0;
    let updateStr = {};

    let indexStr = keyName;
    updateStr[indexStr] = setValue;
    //updateStr. = arrayStr;

    console.log(updateStr);

    // 지정 어레이 인덱스의 요소값 변경
    try {
      const resData = await RoomInfo.findOneAndUpdate(
        { room_id: roomid },
        updateStr,
        {
          upsert: true,
          returnOriginal: false,
        }
      );
      if (resData) {
        console.log('room data update success');
        console.log(resData);
      } else {
        retCode = 4;
      }
    } catch (err) {
      retCode = 99;
      console.log('roomDataUpdate err:' + err);

    }
    return retCode;
  }
  /**
   * room array member element update
   * @param {string} roomid 룸아이디
   * @param {string} keyName 룸객체내의 변수 이름
   * @param {number} nindex  
   * @param {any} setValue 설정값
   * @returns 
   */
  async roomArrayUpdate(roomid, keyName, nindex, setValue) {
    let retCode = 0;
    let updateStr = {};
    let arrayStr = {};

    if (nindex == -1) {
      // 지정 배열 전체 값  변경 
      let indexStr = keyName + ".$[]";
      arrayStr[indexStr] = setValue;
      updateStr.$set = arrayStr;
      try {
        const resData = await RoomInfo.findOneAndUpdate(
          { room_id: roomid },
          updateStr,
          {
            upsert: true,
            returnOriginal: false,
          }
        );
        if (resData) {
          console.log('array all data change success');
          console.log(resData);
        } else {
          retCode = 4;
        }
      } catch (err) {
        retCode = 99;
        console.log(err);

      }

    } else {
      let indexStr = keyName + '.' + nindex;
      arrayStr[indexStr] = setValue;
      updateStr.$set = arrayStr;

      // 지정 어레이 인덱스의 요소값 변경
      try {
        const resData = await RoomInfo.findOneAndUpdate(
          { room_id: roomid },
          updateStr,
          {
            upsert: true,
            returnOriginal: false,
          }
        );
        if (resData) {
          console.log('array element data change success');
          console.log(resData);
        } else {
          retCode = 4;
        }
      } catch (err) {
        retCode = 99;
        console.log(err);

      }
    }
    return retCode;
  }
  /**
   * deck card push
   * @param {*} roomid 
   * @param {*} keyName 
   * @param {*} setValue 
   * @returns 
   */
  async roomCardPush(roomid, keyName, setValue) {
    let retCode = 0;
    let updateStr = {};
    let arrayStr = {};

    arrayStr[keyName] = setValue;
    updateStr.$push = arrayStr;
    // 지정 어레이 인덱스의 요소값 변경
    try {
      const resData = await RoomInfo.findOneAndUpdate(
        { room_id: roomid },
        updateStr,
        {
          upsert: true,
          returnOriginal: false,
        }
      );
      if (resData) {
        console.log('deckcard pushsuccess');
        console.log(resData);
      } else {
        retCode = 4;
      }
    } catch (err) {
      retCode = 99;
      console.log(err);

    }

    return retCode;
  }

  async roomCardReset(roomid, keyName) {
    let retCode = 0;
    let updateStr = {};
    let arrayStr = {};

    arrayStr[keyName] = [];
    updateStr.$set = arrayStr;
    // 지정 어레이 인덱스의 요소값 변경
    try {
      const resData = await RoomInfo.findOneAndUpdate(
        { room_id: roomid },
        updateStr,
        {
          upsert: true,
          returnOriginal: false,
        }
      );
      if (resData) {
        console.log('deckcard reset success');
        console.log(resData);
      } else {
        retCode = 4;
      }
    } catch (err) {
      retCode = 99;
      console.log(err);

    }
    return retCode;
  }

  getPopCard() {
    return this.popCard;
  }

  async deckCardPop(roomid) {
    let retCode = 0;
    try {
      const resData = await Dealercard.findOne(
        { room_id: roomid },
      );
      if (resData) {
        this.popCard = resData.cards[resData.popIndex];
        resData.popIndex++;
        await resData.save();
        console.log(resData);
      } else {
        retCode = 4;
      }
    } catch (err) {
      retCode = 99;
      console.log(err);
    }
    return retCode;
  }

  async joinRoom(roomid, playerid) {
    let retCode = 0;
    // NONE 인 첫번째 어레이 데이터에 유저 등록
    try {
      const resData = await RoomInfo.findOneAndUpdate(
        { room_id: roomid, player: "NONE" },
        { $set: { "player.$": playerid } },
        {
          upsert: true,
          returnOriginal: false,
        });
      if (resData) {
        console.log(resData);
      } else {
        retCode = 4;
      }
    } catch (err) {
      console.log(err);
      retCode = 99;
    }
    return retCode;
  }

  async exitRoom(roomid, playerid) {
    let retCode = 0;
    // NONE 인 첫번째 어레이 데이터에 유저 등록
    try {
      const resData = await RoomInfo.findOneAndUpdate(
        { room_id: roomid, player: playerid },
        { $set: { "player.$": "NONE" } },
        {
          upsert: true,
          returnOriginal: false,
        }
      );
      if (resData) {
        console.log(resData);

      } else {
        retCode = 4;
      }
    } catch (err) {
      console.log(err);
      retCode = 99;
    }
    return retCode;
  }
  /**
   * retcode : 0 success,1 passwd fail,2 used id,3 id not exist
   * @param {*} userid 
   * @param {*} passwd 
   */
  async loginUser(userid, passwd) {
    let retCode = 0;
    try {
      const user = await Players.findOne({ user_id: userid });
      // user id exist ?
      if (user) {
        console.log("find user:" + user.user_id)
        //console.log(user);
        //res.json({ message: 'find user:' + user[0].user_id })
        if (user.loginedUser == false) {
          if (user.user_id == userid && user.password != passwd) {
            retCode = 1; // 비밀번호 틀림.
            console.log('password fail....')
          } else {
            user.loginedUser = true;
            await user.save();
          }
        } else {
          retCode = 3;// 아이디 사용중
          console.log('playing(logined) id .....');
        }
      } else {
        retCode = 4; // not find id
      }
    } catch (err) {
      // not found user id
      retCode = 99;
      console.log(err);
    }

    return retCode;
  }
  async loginOutUser(userid, passwd) {
    let retCode = 0;
    try {
      const user = await Players.findOne({ user_id: userid });
      // user id exist ?
      if (user) {
        console.log("logout user:" + user.user_id)
        //console.log(user);
        //res.json({ message: 'find user:' + user[0].user_id })
        if (user.user_id == userid && user.password == passwd) {
          if (user.loginedUser == true) {
            user.loginedUser = false;
            await user.save();
          } else {
            retCode = 2; // 미사용 아이디
            console.log(`not playing(logined) : ${user.user_id}`);
          }
        }
      } else {
        retCode = 4;// not find id
      }
    } catch (err) {
      // not found user id
      retCode = 99;
      console.log(err);
    }

    return retCode;
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

/*
*
*  async/await promise example 
*
let last_max_code = -1;
function sqlPromise(sqlStr) {
  return new Promise((resolve,reject) => {
    maria.query(sqlStr, function(err, rows, fields) {
      if(!err) {
        last_max_code = rows[0].max_code+1;
        resolve(last_max_code);
        //console.log(rows[0].max_code+1);
      } else {
        reject(-1);
        console.log("getMax_dtcode err : " + err);
      }
    });
  });
}

async function getMaxCodeFromDB() {
  await sqlPromise('SELECT MAX(DT_CODE) AS max_code FROM FT_GR_DT_INFO');
  return last_max_code;
}

router.post('/api/post/dt_infoadd', function(req, res) {
  let insert_dt_code=300004;
  console.log(req.body) ;
  console.log(`body Data: ${ req.body.dt_name }`) ;
  
  getMaxCodeFromDB().then(
    tempMax => {
      console.log(`wait finished  tempMax : ${tempMax}`);
      insert_dt_code = tempMax;
      
      res.status(200).json({
        "dt_code" : insert_dt_code
      });       
    }
  );
*/
