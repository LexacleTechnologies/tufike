const express = require('express');
let app = express.Router();

app.get('/notifications', function(req, res, next) {
    if (req.session.loggedin) {
        var uid = req.session.uid;
        var pdata = {
            uid: uid,
            title: 'Tufike Pamoja Admin | Notifications',
            pagefunctions: 'installApp();notifications();',
            dashboard: '',
            riders: '',
            drivers: '',
            vehicles: '',
            rides: '',
            distress: '',
            packages: '',
            notifications: 'active',
            promotions: '',
            points: '',
            payments: '',
            support: '',
            users: '',
            settings: '',
            profile: ''
        };
        res.render('layouts/notifications.hbs', {
            pdata
        })
      } else {
        res.redirect('/login');
      }
  })

module.exports = app
