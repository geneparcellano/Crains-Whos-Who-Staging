var express = require('express');

var app = express(express.logger());

auth = express.basicAuth('vokal', 'crains123')
app.configure(function() {
    app.all('*', auth);
    app.use(express.static(__dirname + '/static'));
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
