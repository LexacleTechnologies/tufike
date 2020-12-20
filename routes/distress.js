const express = require('express');
let app = express.Router();

function adminLogin(req, res, next) {
    res.render('layouts/auth.hbs', {
        title: 'Tufike Pamoja Admin | Login',
        pagefunctions: 'auth();',
        developer: 'https://lexacle.com'
    })
}
app.get('/distress', function(req, res, next) {
    if (req.session.loggedin) {
        var uid = req.session.uid;
        var pdata = {
            uid: uid,
            title: 'Tufike Pamoja Admin | Distress Alerts',
            pagefunctions: 'distress();',
            dashboard: '',
            riders: '',
            drivers: '',
            vehicles: '',
            rides: '',
            distress: 'active',
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
        res.render('layouts/distress.hbs', {
            pdata
        })
    } else {
        adminLogin(req, res, next);
    }
})

module.exports = app