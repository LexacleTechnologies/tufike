const express = require('express');
let app = express.Router();

function adminLogin(req, res, next) {
    res.render('layouts/auth.hbs', {
        title: 'Tufike Pamoja Admin | Login',
        pagefunctions: 'auth();',
        developer: 'https://lexacle.com'
    })
}
app.get('/vehicles', function(req, res, next) {
    if (req.session.loggedin) {
        var uid = req.session.uid;
        var pdata = {
            uid: uid,
            title: 'Tufike Pamoja Admin | Vehicles',
            pagefunctions: 'vehicles();',
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
        adminLogin(req, res, next);
    }
})

module.exports = app