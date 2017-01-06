var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var https = require("https");
var http = require("http");
var request = require('request');
var admin = require("firebase-admin");
var path = require('path');
var firebase = require('firebase');
var FCM = require('fcm-node');

app.use(bodyParser.json());

var config = {
    apiKey: "AIzaSyBLjKr4oeu81zInYaY955Ng4akR9tkh6Qc",
    authDomain: "messenger-59edd.firebaseapp.com",
    databaseURL: "https://messenger-59edd.firebaseio.com"
};
firebase.initializeApp(config);
var database = firebase.database();

app.get('/', function (req, res) {
    res.send("TEST!!");
});

app.post('/webhook', function (req, res) {

    var number = req.body.result.parameters.Number;
    var contact = req.body.result.parameters.Contact;
    var message = req.body.result.parameters.Message;
    var pin = req.body.result.parameters['PIN'];
    number = number.replace(/-/g, "");
    console.log(number);
    database.ref('/users/' + number).once('value').then(function (snapshot) {
        var token = snapshot.val().token;
        sendMessage(token, contact, message, pin);
        res.set('Content-Type', 'application/json');
        res.send(makeWebhookResult());
    });
});

var sendMessage = function (token, contact, message, pin) {
    var serverKey = 'AAAAcT2AGSY:APA91bG8fEMHrOg1IaunbxPa0lm7dmo_AK9VQuLVtMzkr_9a-o0FPyKzUJenfz7cix5ruk6XRetpGhBSALC2rhaWRYHNphD65Bm0xGZLmNSMvQJyZqqUDAPMPPX8X8ILmDkoD5ZQr3_Mo-oanOLOGGnXn7YrB5OmCA';
    var fcm = new FCM(serverKey);

    var config = {
        registration_ids: [token],
        "data": {
            "text": message,
            "contact": contact,
            "pin": pin
        }
    };

    fcm.send(config, function(err,response){
        if(err) {
            console.log(err);
        }
    });
};

var makeWebhookResult = function () {
    return JSON.stringify({
        "speech": "Message sent!",
        "displayText": "Message sent!",
        "source": "Messenger"
    })
};

var server = app.listen(process.env.PORT || 8081, function () {
    console.log("Listening at http://162.243.41.219:80/")
});
