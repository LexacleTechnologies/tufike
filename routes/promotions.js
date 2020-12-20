const express = require('express');
let app = express.Router();

function adminLogin(req, res, next) {
    res.render('layouts/auth.hbs', {
        title: 'Tufike Pamoja Admin | Login',
        pagefunctions: 'auth();',
        developer: 'https://lexacle.com'
    })
}
app.get('/promotions', function(req, res, next) {
    if (req.session.loggedin) {
        var uid = req.session.uid;
        var pdata = {
            uid: uid,
            title: 'Tufike Pamoja Admin | Promotions',
            pagefunctions: 'promotions();',
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
        adminLogin(req, res, next);
    }
})

module.exports = app