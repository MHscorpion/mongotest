const express = require('express');
const http = require("http");
const bodyParser = require("body-parser");
const Players = require('./schemas/users.js');
const RoomInfo = require('./schemas/roominfo.js');
const Dealercard = require('./schemas/dealercard.js');
const mongoHandler = require('./utility/mongoaccess.js');

const mongoAccess = new mongoHandler();

const mongoose = require('mongoose');
const { parseArgs } = require('util');
const server = express();

const handleOpen = () => console.log("connected to DB!");
const handleError = (error) => console.log("DB Error", error);

server.get('/', (req, res) => {
  /*
  Players.find({})
    .then((user) => {
      console.log(user);
      res.json({ message: 'user list:' + user })
    }).catch((err) => {
      res.json({
        message: err
      })
    });
    */
  /*
    Dealercard.find({})
      .then((deckCard) => {
        //console.log(deckCard[0].cards[0]);
        console.log(deckCard);
        res.json({ message: 'card list:' + deckCard })
      }).catch((err) => {
        res.json({
          message: err
        })
      });
      */
  res.json({ message: 'not suppotr....' });

})

server.get('/getlist/:object', (req, res) => {
  let params = req.params;
  console.log(params);
  if (params.object == 'players') {
    Players.find({})
      .then((resData) => {
        console.log(resData);
        //res.send({ message: 'players list:' + resData })
        res.send(resData)
      }).catch((err) => {
        res.json({
          message: err
        })
      });
  }
  if (params.object == 'rooms') {
    RoomInfo.find({})
      .then((resData) => {
        console.log(resData);
        res.json({ message: 'rooms list:' + resData })
        //res.send(JSON.stringify(resData))
      }).catch((err) => {
        res.json({
          message: err
        })
      });
  }
  if (params.object == 'cards') {

    Dealercard.find({})
      .then((resData) => {
        //console.log(deckCard[0].cards[0]);
        console.log(resData);
        //res.json({ message: 'cards list:' + resData })
        res.send(resData)
      }).catch((err) => {
        res.json({
          message: err
        })
      });
  }
})

server.get('/adduser/:name/:passwd/:nick', (req, res) => {
  /*
    let userId = req.params('name');
    let userPasswd = req.params('passwd');
    let nickName = req.params('nick');
    let haveChip = req.params('chips');
    */
  let params = req.params;
  console.log(params);

  let newUser = new Players();
  newUser.user_id = params.name;
  newUser.password = params.passwd;
  newUser.nick = params.nick;

  Players.insertMany(newUser)
    //newUser.save()
    .then((user) => {
      console.log(user);
      res.json({ message: params.name + ' user create success...' })
    }).catch((err) => {
      console.log(err);
      res.json({
        message: err
      })
    })

})

server.get('/delall', (req, res) => {
  //const newUser = new User();

  Players.deleteMany({})
    .then((user) => {
      console.log(user);
      res.json({ message: 'all delete' })
    }).catch((err) => {
      res.json({
        message: 'err.toString()'
      })
    })
})

server.get('/find/:type/:id/:playerid', (req, res) => {

  let params = req.params;
  console.log(params);
  console.log(params.playerid);

  if (params.type == "rooms") {
    /*
    // find roominfo
    RoomInfo.find({ room_id: params.id })
      .then((resData) => {
        console.log(resData);
        //res.json({ message: 'find roominfo:' + resData })
        res.json({ message: 'find roominfo players:' + resData })
      }).catch((err) => {
        res.json({
          message: 'err.toString()'
        })
      })
     */
    /*
    RoomInfo.find({ room_id: params.id })
      .then((resData) => {
        console.log(resData);
        //res.json({ message: 'find roominfo:' + resData })
        //res.json({ message: 'find roominfo players:' + resData })
        if (resData.length > 0) {
          
          resData[0].playersResponse[params.playerid] = 1;
          resData[0].save()
            .then((saveData) => {
              console.log(saveData);
              res.json({ message: 'find roominfo:' + saveData })
              //res.json({ message: 'find roominfo players:' + resData })


            }).catch((err) => {
              res.json({
                message: 'resData save error...'
              })
            })
        } // if length
      }).catch((err) => {
        res.json({
          message: 'room find error...'
        })
      })*/
    RoomInfo.updateOne({ room_id: params.id, players: params.playerid }, { $set: { "playersResponse.$": 1 } })
      .then((resData) => {
        console.log(resData);
        res.json({ message: 'update roominfo:' + resData })
        //res.json({ message: 'find roominfo players:' + resData })


      }).catch((err) => {
        res.json({
          message: 'room find error...'
        })
      })


    //res.json({ message: 'test ok' });
  }// if rooms 
})

server.get('/joinroom/:roomid/:userid', (req, res) => {
  //const newUser = new User();
  let params = req.params;
  console.log(params);
  let retCode = mongoAccess.setDataInArray(params.roomid,'player',4,'set');//joinRoom(params.roomid, params.userid);
  if (retCode == 0) {
    res.json({ message: params.roomid + " join success!!" });
  } else {
    res.json({ message: params.roomid + " join fail!! :" + retCode.toString });
  }

})

server.get('/addroom/:room_id', (req, res) => {
  /*
    let userId = req.params('name');
    let userPasswd = req.params('passwd');
    let nickName = req.params('nick');
    let haveChip = req.params('chips');
    */
  let params = req.params;
  console.log(params);
  let retCode = mongoAccess.createRoom(params.room_id);
  if (retCode === 0) {
    res.json({ message: params.room_id + " create success!!" });
  } else {
    res.json({ message: params.room_id + " create fail!! :" + retCode.toString });
  }

})


server.listen(3000, (err) => {
  if (err) {
    return console.log(err);
  } else {
    mongoose.connect("mongodb+srv://androlimo2osys:Must980419@mongocluster.sm5hzzb.mongodb.net/?retryWrites=true&w=majority", {
      dbName: 'mydb', // 실제로 데이터 저장할 db명
     
    });

    //createPokerArray();
    const db = mongoose.connection; //mongoose로 연결한 첫번째 연결을 의미합니다. 자세한건 후술
    db.on("error", handleError);
    db.once("open", handleOpen);
  }
})






