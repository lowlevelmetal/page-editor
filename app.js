// Init express and fs
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
const jsonfile = require('jsonfile')

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set("view engine", "ejs");

// Listen to port
app.listen(3000, function(){
    console.log("Listening on port 3000");
    setInterval(function(){
        console.log("Server Status: stable");
    }, 60000);
});

// Root query
app.get('/', function(req, res){
    if(req.ip === "::ffff:127.0.0.1") {
        try {
            var json = JSON.parse(fs.readFileSync('./matthew' + '.json', 'utf8'));
            res.render('profile', {person: "matthew", data: json});
            console.log("ADMIN LOGGED IN AUTOMATICALLY");
        } catch(err) {
            res.render('main');
        }
    } else {
        res.render('main');
    }
});

// ADMIN
app.get('/:data', function(req, res){
    try {
        var json = JSON.parse(fs.readFileSync('./matthew' + '.json', 'utf8'));
        res.render('admin', {person: "admin", data: json});
    } catch(err) {
        res.render('main');
    }
});

app.post('/:data', urlencodedParser, function(req, res){
    if (!req.body) return res.sendStatus(400);
    console.log("User " + req.params.data + " sent: " + req.body.passwd);

    console.log(req.ip + " Is trying to access " + __dirname + "/" + req.params.data);

    // Catch errors
    if(req.body.passwd === "lily.geiger1") {
        // Parse JSON file
        var json = JSON.parse(fs.readFileSync('./' + req.params.data + '.json', 'utf8'));
        // Respond with JSON edited HTML
        res.render('profile', {person: req.params.data, data: json});
        console.log(req.ip + " accessed " + __dirname + "/" + req.params.data);
    } else {
        res.render('404');
        console.log(req.ip + " failed to access " + __dirname + "/" + req.params.data);
    }
})

// Profile query
app.get('/home/:data', function(req, res){
    console.log(req.ip + " Is trying to access " + __dirname + "/" + req.params.data);

    // Catch errors
    try {
        // Parse JSON file
        var json = JSON.parse(fs.readFileSync('./' + req.params.data + '.json', 'utf8'));
        // Respond with JSON edited HTML
        res.render('profile', {person: req.params.data, data: json});
        console.log(req.ip + " accessed " + __dirname + "/" + req.params.data);
    } catch (err) {
        res.render('404');
        console.log(req.ip + " failed to access " + __dirname + "/" + req.params.data);
    }
});

app.post('/home/:data', urlencodedParser, function(req, res){
    if (!req.body) return res.sendStatus(400);
    console.log("User " + req.params.data + " sent: " + req.body.style);

    const obj = {
        "contact": {
            "style": req.body.style,
            "view": 1
        }
    };
    
    jsonfile.writeFileSync('./' + req.params.data + '.json', obj);

    console.log(req.ip + " Is trying to access " + __dirname + "/" + req.params.data);

    // Catch errors
    try {
        // Parse JSON file
        var json = JSON.parse(fs.readFileSync('./' + req.params.data + '.json', 'utf8'));
        // Respond with JSON edited HTML
        res.render('profile', {person: req.params.data, data: json});
        console.log(req.ip + " accessed " + __dirname + "/" + req.params.data);
    } catch (err) {
        res.render('404');
        console.log(req.ip + " failed to access " + __dirname + "/" + req.params.data);
    }
})

// Profile contact query
app.get('/home/:data/contact', function(req, res){
    console.log(req.ip + " Is trying to access " + __dirname + "/" + req.params.data + "/contact");

    // Catch errors
    try {
        // Parse JSON file
        var json = JSON.parse(fs.readFileSync('./' + req.params.data + '.json', 'utf8'));
        // Respond with JSON edited HTML
        res.render('contact', {person: req.params.data, data: json});
        console.log(req.ip + " accessed " + __dirname + "/" + req.params.data + "/contact");
    } catch (err) {
        res.render('404');
        console.log(req.ip + " failed to access " + __dirname + "/" + req.params.data + "/contact");
    }
});

// API query
app.get('/api/:data', function(req, res){
    console.log(req.ip + " Is trying to access " + __dirname + "/" + req.params.data)

    if(req.params.data === "admin") {
        res.render('404');
        console.log(req.ip + " failed to access " + __dirname + "/" + req.params.data);
    }

    // Catch errors
    try {
        // CHECK FOR JSON
        var json = fs.readFileSync('./' + req.params.data + '.json', 'utf8');
        // Send API
        res.sendFile(__dirname + "/" + req.params.data + ".json");
        console.log(req.ip + " accessed " + __dirname + "/" + req.params.data);
    } catch(err) {
        res.render('404');
        console.log(req.ip + " failed to access " + __dirname + "/" + req.params.data);
    }
});
