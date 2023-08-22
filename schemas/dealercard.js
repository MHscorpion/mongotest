const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const DealerCard = new Schema({
  room_id: {
    required: true,
    unique: true,
    type: String,
  },
  cards: {
    required: true,
    type: [String],
  }
});

module.exports = mongoose.model('Dealercard', DealerCard);
