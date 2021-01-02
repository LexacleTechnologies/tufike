const express = require('express');
let app = express.Router();

app.get('/settings', function(req, res, next) {
    if (req.session.loggedin) {
        var uid = req.session.uid;
        var pdata = {
            uid: uid,
            title: 'Tufike Pamoja Admin | Settings',
            pagefunctions: 'installApp();settings();',
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
            users: '',
            settings: 'active',
            profile: ''
        };
        res.render('layouts/settings.hbs', {
            pdata
        })
    } else {
        res.redirect('/login');
    }
})

module.exports = app
