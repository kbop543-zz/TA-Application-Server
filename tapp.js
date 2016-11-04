'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var ta = require('./routes');
var app = express();

app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/'));


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// Get the html page
app.get('/', function(req, res) {
    res.sendfile('ta.html');
});

//Routes

app.get('/applicants', ta.findAll);

app.post('/applicants', ta.addOne);

/*app.get('/applicants?status?status=status', ta.findByStatus);

app.get('/applicants?fname=fname', ta.findByName);*/


// Start the server
app.listen(3000);
console.log('Listening on port 3000');
