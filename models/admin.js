const mongoose = require('mongoose');
const colors = require('colors');
const logSymbols = require('log-symbols');
const Schema = mongoose.Schema;

const Admin = mongoose.model('Admin', new mongoose.Schema({
    firstname: {
        index: true,
        type: String,
        required: true
    },
    lastname: {
        index: true,
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        index: true,
        type: String,
        required: true
    },
    photo: {
        index: true,
        type: String,
        required: true
    },
    password: {
        index: true,
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    status: {
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
    time: {
        type: Number,
        required: true
    },
}, { timestamps: true }));
Admin.find().exec(function(err, result) {
    if (err) { console.log(logSymbols.error, 'Could not initiate admin bson import'.red) } else {
        Admin.createIndexes();
        if (result.length === 0) {
            var data = { firstname: 'Tufike', lastname: 'Pamoja', email: 'tufike@lexacle.com', phone: '0727779929', photo: 'admin.png', password: 'Tufike@2020', level: 1, about: 'About Tufike Pamoja Admin', status: 1, settings: { notifications: 1, theme: 'green', mode: 'dark', rate: 0, online: 0 }, time: Date.now() };
            const Adminsave = new Admin(data)
            Adminsave.save((err, result) => {
                if (err) {
                    console.log(logSymbols.error, 'Admin schema initialization failes'.red)
                } else {
                    console.log(logSymbols.success, 'Admin schema has been initialized successfully'.blue)
                }
            })
        }
    }
})
module.exports = Admin;
