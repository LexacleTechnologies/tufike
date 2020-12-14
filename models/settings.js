const mongoose = require('mongoose');
const colors = require('colors');
const logSymbols = require('log-symbols');
const Schema = mongoose.Schema;

const Setting = mongoose.model('Setting', new mongoose.Schema({
  setid: {
    index: true,
    type: String,
    required: true
  },
  setnot: {
    index: true,
    type: Number,
    required: true
  },
  setcron: {
    index: true,
    type: Number,
    required: true
  },
  setrides: {
    index: true,
    type: Number,
    required: true
  },
  setmin: {
    type: Number,
    required: true,
    unique: true
  },
  setmax: {
    index: true,
    type: Number,
    required: true
  },
  setbrands: {
    index: true,
    type: Number,
    required: true
  },
  setmail: {
    index: true,
    type: String,
    required: true
  },
  setphone: {
    type: String,
    required: true
  },
  setperpoint: {
    type: Number,
    required: true
  },
  setminredeem: {
    type: Number,
    required: true
  },
  setmaxredeem: {
    type: Number,
    required: true
  },
  setchat: {
    type: String,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
}, {timestamps: true}));
Setting.createIndexes();

Setting.find().exec(function(err, result){
  if(err){console.log(logSymbols.error, 'Could not initiate settings bson import'.red)}
  else {
    if(result.length === 0)
    {
      var data = {setid: 'main', setnot: 1, setcron: 10, setrides: 2, setmin: 0, setmax: 0, setbrands: 1, setmail: 'tufike@lexacle.com', setphone: '0727779929', setperpoint: 2, setminredeem: 20, setmaxredeem: 100, setchat: 'Greetings, Welcome to Tufike Pamoja Cabs, how may I be of help to you?', time: Date.now()};
      const Settingsave = new Setting(data)
      Settingsave.save((err,result)=>{
        if(err)
        {
            console.log(logSymbols.error, 'Settings schema failed to initialize'.red)
        }
        else
        {
          console.log(logSymbols.success, 'Settings schema has been initialized successfully'.blue)
        }
      })
    }
  }
})
module.exports = Setting;
