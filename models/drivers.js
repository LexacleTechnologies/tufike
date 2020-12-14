const mongoose = require('mongoose');
const colors = require('colors');
const logSymbols = require('log-symbols');
const Schema = mongoose.Schema;

const Driver = mongoose.model('Driver', new mongoose.Schema({
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
  photo: {
    type: String,
    required: true
  },
  license: {
    type: String,
    required: true
  },
  ntsa: {
    type: String,
    required: true
  },
  vehicle: {
    type: Schema.Types.ObjectId,
    required: true
  },
  package: {
    type: Schema.Types.ObjectId,
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
  blend: {
    type: Number,
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
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
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
    },
  },
  status: {
    type: Number,
    required: true
  }
}, {timestamps: true}));
Driver.createIndexes({location: '2dsphere'});
Driver.createIndexes();
/*
Driver.find().exec(function(err, result){
  if(err){console.log(logSymbols.error, 'Could not initialize test driver'.red)}
  else {
    if(result.length === 0)
    {
      var data = {signalid: 'oneburst-unkown', firstname: 'Test', lastname: 'Driver', email: 'tufike@lexacle.com', phone: '0700000000', photo: 'driver.png', password: 'Driver@2020', activationcode: 'BBV484', license: 'none', ntsa: 'none', vehicle: 'none', location: {type: "Point", coordinates: [36.8771072, -1.2582912]}, settings: {notifications: 1, theme: 'color-theme-purple', mode: 'light', rate: 5}, status: 1, created: Date.now()};
      const Driversave = new Driver(data)
      Driversave.save((err,result)=>{
        if(err)
        {
          console.log(err)
            console.log(logSymbols.error, 'Test Driver schema failed to initialize'.red)
        }
        else
        {
          console.log(logSymbols.success, 'Test Driver schema has been initialized successfully'.blue)
        }
      })
    }
  }
})
*/
module.exports = Driver;
