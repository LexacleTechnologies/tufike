const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Ride = mongoose.model('Ride', new mongoose.Schema({
  rider: {
    type: Schema.Types.ObjectId,
    required: true
  },
  driver: {
    type: Schema.Types.ObjectId,
    required: true
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  packageid: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  packagename: {
    type: String,
    required: true,
  },
  driveraccept: {
    type: Number,
    required: true,
  },
  driverinit: {
    type: Number,
    required: true,
  },
  driverarrive: {
    type: Number,
    required: true,
  },
  driverstart: {
    type: Number,
    required: true,
  },
  driverstop: {
    type: Number,
    required: true,
  },
  driverrating: {
    type: Number,
    required: true,
  },
  drivercomment: {
    type: String,
    required: true,
  },
  clientrating: {
    type: Number,
    required: true,
  },
  clientcomment: {
    type: String,
    required: true,
  },
  appprice: {
    type: Number,
    required: true,
  },
  actprice: {
    type: Number,
    required: true,
  },
  paystat: {
    type: Number,
    required: true,
  },
  discountpoints: {
    type: Number,
    required: true,
  },
  rewardedpoints: {
    type: Number,
    required: true,
  },
  redeemedpoints: {
    type: Number,
    required: true,
  },
  discountpromos: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  position: {
    origin: {
    type: String,
    required: true
    },
    destination: {
    type: String,
    required: true
    }
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

Ride.createIndexes();

module.exports = Ride;
