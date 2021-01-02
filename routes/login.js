const express = require('express');
let app = express.Router();

app.get('/login', function(req, res, next) {
    res.render('layouts/auth.hbs', {
        title: 'Tufike Pamoja Admin | Login',
        pagefunctions: 'installApp();auth();',
        developer: 'https://lexacle.com'
    })
})

module.exports = app
