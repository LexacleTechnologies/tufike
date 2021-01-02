const express = require('express');
let app = express.Router();

app.get('/packages', function(req, res, next) {
    if (req.session.loggedin) {
        var uid = req.session.uid;
        var pdata = {
            uid: uid,
            title: 'Tufike Pamoja Admin | Packages',
            pagefunctions: 'installApp();packages();',
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
        res.redirect('/login');
      }
  })

module.exports = app
