const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Chat = mongoose.model('Chats', new mongoose.Schema({
  conversationid: {
    index: true,
    type: String,
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    required: true
  },
  receiver: {
    type: Schema.Types.ObjectId,
    required: true, 
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
  receiverphoto: {
    type: String, 
    required: true
  },
  message: {
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
Chat.createIndexes();

module.exports = Chat;