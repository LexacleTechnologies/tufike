const express = require('express');
let app = express.Router();

app.get('/profile', function(req, res, next) {
    if (req.session.loggedin) {
        var uid = req.session.uid;
        var pdata = {
            uid: uid,
            title: 'Tufike Pamoja Admin | Profile',
            pagefunctions: 'installApp();profile();',
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
            payments: '',
            support: '',
            users: '',
            settings: '',
            profile: 'active'
        };
        res.render('layouts/profile.hbs', {
            pdata
        })
      } else {
        res.redirect('/login');
      }
  })

module.exports = app
