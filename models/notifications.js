const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notification = mongoose.model('Notifications', new mongoose.Schema({
  userid: {
    index: true,
    type: Schema.Types.ObjectId,
    required: true
  },
  sender: {
    index: true,
    type: String,
    required: true
  },
  icon: {
    type: String, 
    required: true
  },
  title: {
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
Notification.createIndexes();

module.exports = Notification;