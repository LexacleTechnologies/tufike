const express = require('express');
let app = express.Router();

app.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.redirect('/login')
    next()
})

module.exports = app
