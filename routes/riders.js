const express = require('express');
let app = express.Router();

app.get('/riders', function(req, res, next) {
    if (req.session.loggedin) {
        var uid = req.session.uid;
        var pdata = {
            uid: uid,
            title: 'Tufike Pamoja Admin | Riders',
            pagefunctions: 'installApp();loadMapScript();riders();',
            dashboard: '',
            riders: 'active',
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
            settings: '',
            profile: ''
        };
        res.render('layouts/riders.hbs', {
            pdata
        })
    } else {
        res.redirect('/login');
    }
})

module.exports = app
