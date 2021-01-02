const express = require('express');
let app = express.Router();

app.get('/users', function(req, res, next) {
    if (req.session.loggedin) {
        var uid = req.session.uid;
        var pdata = {
            uid: uid,
            title: 'Tufike Pamoja Admin | Users',
            pagefunctions: 'installApp();users();',
            dashboard: '',
            riders: '',
            drivers: '',
            vehicles: '',
            rides: '',
            distress: '',
            packages: '',
            notifications: '',
            promotions: '',
            points: '',
            payments: '',
            support: '',
            users: 'active',
            settings: '',
            profile: ''
        };
        res.render('layouts/users.hbs', {
            pdata
        })
    } else {
        res.redirect('/login');
    }
})

module.exports = app
