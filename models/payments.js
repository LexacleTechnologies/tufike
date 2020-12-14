const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Payment = mongoose.model('Payment', new mongoose.Schema({
  cashier: {
    type: Schema.Types.ObjectId,
    required: true
  },
  driver: {
    type: Schema.Types.ObjectId,
    required: true
  },
  vehicle: {
    type: Schema.Types.ObjectId,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  code: {
    type: String,
    required: true
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

Payment.createIndexes();

module.exports = Payment;