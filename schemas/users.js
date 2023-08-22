const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const UserSchema = new Schema({
  user_id: {
    required: true,
    unique: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  nick: {
    required: true,
    type: String,
    unique: true,
  },
  chips: {
    type: String,
    default: "10000000"
  },
  joinedRoom: {
    type: String,
    default: "notjoin",
  },
  myBettingAmt: {
    type: Number,
    default: 0,
  },
  modDate: {
    type: Date,
    default: Date.now(),
  }

});

module.exports = mongoose.model('Players', UserSchema);
