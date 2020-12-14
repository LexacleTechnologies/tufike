const mongoose = require('mongoose');
const colors = require('colors');
const logSymbols = require('log-symbols');
const Schema = mongoose.Schema;

const Rate = mongoose.model('Rate', new mongoose.Schema({
  package: {
    type: String,
    required: true
  },
  basefare: {
    type: Number,
    required: true
  },
  minimumfare: {
    type: Number,
    required: true,
  },
  permin: {
    type: Number,
    required: true,
  },
  perkm: {
    type: Number,
    required: true,
  },
  waitingtime: {
    type: Number,
    required: true,
  },
  waitingcharges: {
    type: Number,
    required: true,
  },
  commission: {
    type: Number,
    required: true,
  },
  rewards: {
    type: Number,
    required: true,
  },
  perreward: {
    type: Number,
    required: true,
  },
  minredeem: {
    type: Number,
    required: true,
  },
  maxredeem: {
    type: Number,
    required: true,
  },
  photo: {
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

Rate.createIndexes();

Rate.find().exec(function(err, result){
  if(err){console.log('Failed to initialize Rate defaults');}
  else {
    if(result.length === 0)
    {
      var curdate = Date.now();
      var data = [{package: 'Basic', basefare: 100, minimumfare: 150, permin: 5, perkm: 20, waitingtime: 2, waitingcharges: 5, commission: 10, rewards: 1, perreward: 1, minredeem: 10, maxredeem: 100, photo: 'basic.svg', created: curdate, status: 1 },
      {package: 'Comfy', basefare: 150, minimumfare: 200, permin: 8, perkm: 30, waitingtime: 5, waitingcharges: 5, commission: 15, rewards: 2, perreward: 1, minredeem: 10, maxredeem: 100, photo: 'comfy.svg', created: curdate, status: 1 },
      {package: 'Lux', basefare: 200, minimumfare: 300, permin: 10, perkm: 40, waitingtime: 10, waitingcharges: 5, commission: 20, rewards: 3, perreward: 1, minredeem: 10, maxredeem: 100, photo: 'lux.svg', created: curdate, status: 1 }];
      Rate.insertMany(data).then(function(){
        console.log(logSymbols.success, "Rates schema has been initialized successfully".blue)
      }).catch(function(error){
        console.log(logSymbols.error, "Rates schema could not be initialized".red)
      });
    }
  }
})

module.exports = Rate;
