const express = require('express');
let app = express.Router();

app.get('/drivers', function(req, res, next) {
    if (req.session.loggedin) {
        var uid = req.session.uid;
        var pdata = {
            uid: uid,
            title: 'Tufike Pamoja Admin | Drivers',
            pagefunctions: 'installApp();loadMapScript();drivers();',
            dashboard: '',
            riders: '',
            drivers: 'active',
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
        res.render('layouts/drivers.hbs', {
            pdata
        })
      } else {
        res.redirect('/login');
      }
  })

module.exports = app
