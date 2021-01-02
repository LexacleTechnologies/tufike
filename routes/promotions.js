const express = require('express');
let app = express.Router();

app.get('/promotions', function(req, res, next) {
    if (req.session.loggedin) {
        var uid = req.session.uid;
        var pdata = {
            uid: uid,
            title: 'Tufike Pamoja Admin | Promotions',
            pagefunctions: 'installApp();promotions();',
            dashboard: '',
            riders: '',
            drivers: '',
            vehicles: '',
            rides: '',
            distress: '',
            packages: '',
            notifications: '',
            promotions: 'active',
            points: '',
            payments: '',
            support: '',
            users: '',
            settings: '',
            profile: ''
        };
        res.render('layouts/promotions.hbs', {
            pdata
        })
    } else {
        res.redirect('/login');
    }
})

module.exports = app
