const express = require('express');
let app = express.Router();

app.get('/distress', function(req, res, next) {
    if (req.session.loggedin) {
        var uid = req.session.uid;
        var pdata = {
            uid: uid,
            title: 'Tufike Pamoja Admin | Distress Alerts',
            pagefunctions: 'installApp();distress();',
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
        res.redirect('/login');
      }
  })

module.exports = app
