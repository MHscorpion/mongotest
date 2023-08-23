const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const DealerCard = new Schema({
  room_id: {
    required: true,
    unique: true,
    type: String,
  },
  popIndex: {
    type: [Number],
    default:0,
  },
  cards: {
    required: true,
    type: [String],
  }
});

module.exports = mongoose.model('Dealercard', DealerCard);
