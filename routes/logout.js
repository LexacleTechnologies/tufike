const express = require('express');
let app = express.Router();

app.post('/logout', function(req, res, next) {
    req.session.destroy();
    var response = {
        status: 3
    };
    res.end(JSON.stringify(response))
})

module.exports = app