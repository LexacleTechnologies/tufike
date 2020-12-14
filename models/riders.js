const mongoose = require('mongoose');
const colors = require('colors');
const logSymbols = require('log-symbols');
const Schema = mongoose.Schema;

const Rider = mongoose.model('Rider', new mongoose.Schema({
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
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  photo: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  activationcode: {
    type: String,
    required: true
  },
  created: {
    type: Number,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
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
  activepush: {
    rewards: {
      type: Number,
      required: true
    },
    driverchat: {
      type: Number,
      required: true
    },
    supportchat: {
      type: Number,
      required: true
    },
    promotions: {
      type: Number,
      required: true
    },
    about: {
      type: Number,
      required: true
    },
    terms: {
      type: Number,
      required: true
    },
    privacy: {
      type: Number,
      required: true
    },
    online: {
      type: Number,
      required: true
    },
  },
  status: {
    type: Number,
    required: true
  }
}, {timestamps: true}));
Rider.createIndexes({ location: "2dsphere" });
Rider.createIndexes();

/*
Rider.find().exec(function(err, result){
  if(err){console.log(logSymbols.error, 'Could not initialize test rider'.red)}
  else {
    if(result.length === 0)
    {
      var data = {signalid: 'oneburst-unkown', 
      firstname: 'Test', 
      lastname: 'Rider', 
      email: 'tufike@lexacle.com', 
      phone: '0700000000', 
      photo: 'rider.png', 
      password: 'Rider@2020', 
      activationcode: 'BBV484', 
      location: {type: "Point", coordinates: [36.8771072, -1.2582912]},
      activepush: {rewards: 0, driverchat: 0, supportchat: 0, promotions: 0, about: 0, terms: 0, privacy: 0, online: 0}, 
      settings: {notifications: 1, theme: 'color-theme-purple', mode: 'light', rate: 5}, status: 2, created: Date.now()};
      const Ridersave = new Rider(data)
      Ridersave.save((err,result)=>{
        if(err)
        {
          console.log(err)
            console.log(logSymbols.error, 'Test Rider schema failed to initialize'.red)
        }
        else
        {
          console.log(logSymbols.success, 'Test Rider schema has been initialized successfully'.blue)
        }
      })
    }
  }
})
*/

module.exports = Rider;
