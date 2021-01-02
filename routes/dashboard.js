const express = require('express');
let app = express.Router();

app.get('/', function(req, res, next) {
    if (req.session.loggedin) {
        var uid = req.session.uid;
        var pdata = {
            uid: uid,
            title: 'Tufike Pamoja Admin | Dashboard',
            pagefunctions: 'installApp();dashboard();',
            dashboard: 'active',
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
        res.render('layouts/app.hbs', {
            pdata
        })
    } else {
      res.redirect('/login');
    }
})

module.exports = app
