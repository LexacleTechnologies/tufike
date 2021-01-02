const express = require('express');
let app = express.Router();

app.get('/transactions', function(req, res, next) {
    if (req.session.loggedin) {
        var uid = req.session.uid;
        var pdata = {
            uid: uid,
            title: 'Tufike Pamoja Admin | Transactions',
            pagefunctions: 'installApp();payments();',
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
            payments: 'active',
            support: '',
            users: '',
            settings: '',
            profile: ''
        };
        res.render('layouts/transactions.hbs', {
            pdata
        })
    } else {
        res.redirect('/login');
    }
})

module.exports = app
