const mongoose = require('mongoose');
const colors = require('colors');
const logSymbols = require('log-symbols');
const Schema = mongoose.Schema;

const Cms = mongoose.model('Cms', new mongoose.Schema({
  about: {
    index: true,
    type: String
  },
  terms: {
    index: true,
    type: String
  },
  privacy: {
    index: true,
    type: String
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
Cms.createIndexes();

Cms.find().exec(function(err, result){
  if(err){console.log(logSymbols.error, 'Cms Schema could not be initialized'.red);}
  else {
    if(result.length === 0)
    {
    var data = {about: 'One of the greatest things about Lexacle Technologies is that minimal engineering is required to execute tactics - from personalization and segmenting, to A/B testing, and beyond. We leverage machine learning to perform various data intensive operations at the optimal time.', terms: 'One of the greatest things about Lexacle Technologies is that minimal engineering is required to execute tactics - from personalization and segmenting, to A/B testing, and beyond. We leverage machine learning to perform various data intensive operations at the optimal time.', privacy: 'One of the greatest things about Lexacle Technologies is that minimal engineering is required to execute tactics - from personalization and segmenting, to A/B testing, and beyond. We leverage machine learning to perform various data intensive operations at the optimal time.', status: 1, time: Date.now()};
    const Cmssave = new Cms(data)
    Cmssave.save((err,result)=>{
    if(err)
    {
    console.log(logSymbols.error, 'Cms Schema could not be initialized'.red);
    }
    else
    {
    console.log(logSymbols.success, 'Cms Schema has been successfully initialized'.blue);
    }
    })
  }
  }
})
module.exports = Cms;
