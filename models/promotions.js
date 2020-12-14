const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Promo = mongoose.model('Promo', new mongoose.Schema({
  promocode: {
    type: String,
    required: true,
    unique: true
  },
  startdate: {
    type: Number,
    required: true
  },
  stopdate: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  created: {
    type: Number,
    required: true
  },
  status: {
    type: Number,
    required: true
  }
}, {timestamps: true}));

Promo.createIndexes();

module.exports = Promo;
