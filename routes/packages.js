const express = require('express');
let app = express.Router();

function adminLogin(req, res, next) {
    res.render('layouts/auth.hbs', {
        title: 'Tufike Pamoja Admin | Login',
        pagefunctions: 'auth();',
        developer: 'https://lexacle.com'
    })
}
app.get('/packages', function(req, res, next) {
    if (req.session.loggedin) {
        var uid = req.session.uid;
        var pdata = {
            uid: uid,
            title: 'Tufike Pamoja Admin | Packages',
            pagefunctions: 'packages();',
            dashboard: '',
            riders: '',
            drivers: '',
            vehicles: '',
            rides: '',
            distress: '',
            packages: 'active',
            notifications: '',
            promotions: '',
            points: '',
            payments: '',
            support: '',
            users: '',
            settings: '',
            profile: ''
        };
        res.render('layouts/packages.hbs', {
            pdata
        })
    } else {
        adminLogin(req, res, next);
    }
})

module.exports = app