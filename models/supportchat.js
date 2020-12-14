const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Supportchat = mongoose.model('Supportchats', new mongoose.Schema({
  userid: {
    index: true,
    type: String,
    required: true
  },
  sendername: {
    type: String,
    required: true
  },
  receivername: {
    type: String,
    required: true
  },
  senderphoto: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  messagetype: {
    type: String,
    required: true
  },
  account:
  {
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
Supportchat.createIndexes();
module.exports = Supportchat;
