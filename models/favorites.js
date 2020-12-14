const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Favorite = mongoose.model('Favorites', new mongoose.Schema({
  riderid: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  placename: {
    index: true,
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  placeid: {
    index: true,
    type: String,
    required: true
  },
  address: {
    index: true,
    type: String,
    required: true
  },
  icon: {
    index: true,
    type: String,
    required: true
  },
  alias: {
    index: true,
    type: String,
    required: true
  },
  status: {
    type: Number, 
    required: true
  },
  time: {
    type: Number, 
    required: true
  },
}, {timestamps: true}));
Favorite.createIndexes();

module.exports = Favorite;