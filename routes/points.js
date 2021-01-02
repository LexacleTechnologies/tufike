const express = require('express');
let app = express.Router();

app.get('/points', function(req, res, next) {
    if (req.session.loggedin) {
        var uid = req.session.uid;
        var pdata = {
            uid: uid,
            title: 'Tufike Pamoja Admin | Support',
            pagefunctions: 'installApp();points();',
            dashboard: '',
            riders: '',
            drivers: '',
            vehicles: '',
            rides: '',
            distress: '',
            packages: '',
            notifications: '',
            promotions: '',
            points: 'active',
            payments: '',
            support: '',
            users: '',
            settings: '',
            profile: ''
        };
        res.render('layouts/points.hbs', {
            pdata
        })
      } else {
        res.redirect('/login');
      }
  })

module.exports = app
