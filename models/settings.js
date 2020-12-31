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
    setcronfs: {
        type: String,
        required: true
    },
    setcrondb: {
        type: String,
        required: true
    },
    setcronpn: {
        type: String,
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
    setnrider: {
        type: Number,
        required: true
    },
    setndriver: {
        type: Number,
        required: true
    },
    setmpesa: {
        type: Number,
        required: true
    },
    setcard: {
        type: Number,
        required: true
    },
    setpoints: {
        type: Number,
        required: true
    },
    setpromo: {
        type: Number,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
}, { timestamps: true }));
Setting.createIndexes();

Setting.find().exec(function(err, result) {
    if (err) { console.log(logSymbols.error, 'Could not initiate settings bson import'.red) } else {
        if (result.length === 0) {
            var data = { setid: 'main', setnot: 1, setcronfs: '12:00', setcrondb: '12:00', setcronpn: '12:00', setrides: 2, setmin: 0, setmax: 0, setbrands: 1, setmail: 'tufike@lexacle.com', setphone: '0716435983', setperpoint: 2, setminredeem: 20, setmaxredeem: 100, setchat: 'Greetings, Welcome to Tufike Pamoja Cabs, how may I be of help to you?', setnrider: 10000, setndriver: 10000, setmpesa: 0, setcard: 0, setpoints: 1, setpromo: 1, time: Date.now() };
            const Settingsave = new Setting(data)
            Settingsave.save((err, result) => {
                if (err) {
                    console.log(logSymbols.error, 'Settings schema failed to initialize'.red)
                } else {
                    console.log(logSymbols.success, 'Settings schema has been initialized successfully'.blue)
                }
            })
        }
    }
})
module.exports = Setting;
