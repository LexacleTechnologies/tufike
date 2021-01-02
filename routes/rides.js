const express = require('express');
let app = express.Router();

app.get('/rides', function(req, res, next) {
    if (req.session.loggedin) {
        var uid = req.session.uid;
        var pdata = {
            uid: uid,
            title: 'Tufike Pamoja Admin | Rides',
            pagefunctions: 'installApp();loadMapScript();rides();',
            dashboard: '',
            riders: '',
            drivers: '',
            vehicles: '',
            rides: 'active',
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
        res.render('layouts/rides.hbs', {
            pdata
        })
    } else {
        res.redirect('/login');
    }
})

module.exports = app
