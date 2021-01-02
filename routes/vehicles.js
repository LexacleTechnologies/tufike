const express = require('express');
let app = express.Router();

app.get('/vehicles', function(req, res, next) {
    if (req.session.loggedin) {
        var uid = req.session.uid;
        var pdata = {
            uid: uid,
            title: 'Tufike Pamoja Admin | Vehicles',
            pagefunctions: 'installApp();vehicles();',
            dashboard: '',
            riders: '',
            drivers: '',
            vehicles: 'active',
            rides: '',
            distress: '',
            packages: '',
            notifications: '',
            promotions: '',
            points: '',
            payments: '',
            support: '',
            users: '',
            settings: '',
            profile: ''
        };
        res.render('layouts/vehicles.hbs', {
            pdata
        })
    } else {
        res.redirect('/login');
    }
})

module.exports = app
