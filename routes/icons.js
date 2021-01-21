const express = require('express');
let app = express.Router();

app.get('/icons', function(req, res, next) {
    if (req.session.loggedin) {
        var uid = req.session.uid;
        var pdata = {
            uid: uid,
            title: 'Tufike Pamoja Admin | Icon Set',
            pagefunctions: 'installApp();',
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
            settings: '',
            profile: ''
        };
        res.render('layouts/icons.hbs', {
            pdata
        })
    } else {
        res.redirect('/login');
    }
})

module.exports = app
