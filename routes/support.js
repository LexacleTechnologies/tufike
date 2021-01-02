const express = require('express');
let app = express.Router();

app.get('/support', function(req, res, next) {
    if (req.session.loggedin) {
        var uid = req.session.uid;
        var pdata = {
            uid: uid,
            title: 'Tufike Pamoja Admin | Support',
            pagefunctions: 'installApp();support();',
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
            support: 'active',
            users: '',
            settings: '',
            profile: ''
        };
        res.render('layouts/support.hbs', {
            pdata
        })
    } else {
        res.redirect('/login');
    }
})

module.exports = app
