const mongoose = require('mongoose');
const colors = require('colors');
const logSymbols = require('log-symbols');
const Schema = mongoose.Schema;

const Vehicle = mongoose.model('Vehicle', new mongoose.Schema({
  signalid: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  activationcode: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  frontphoto: {
    type: String,
    required: true
  },
  sidephoto: {
    type: String,
    required: true
  },
  backphoto: {
    type: String,
    required: true
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  plate: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  manufacture: {
    type: String,
    required: true
  },
  purchase: {
    type: String,
    required: true
  },
  logbook: {
    type: String,
    required: true
  },
  insurance: {
    type: String,
    required: true
  },
  package: {
    type: Schema.Types.ObjectId,
    required: true
  },
  created: {
    type: Number,
    required: true
  },
  settings: {
    notifications: {
      type: Number,
      required: true
    },
    theme: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      required: true
    },
    rate: {
      type: Number,
      required: true
    },
    online: {
      type: Number,
      required: true
    }
  },
  status: {
    type: Number,
    required: true
  }
}, {timestamps: true}));

Vehicle.createIndexes();
module.exports = Vehicle;
