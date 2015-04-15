// Initialization
var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mongo initialization and connect to database
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/comp20';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

//Enabling CORS
app.all('/', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	response.header('Access-Control-Allow-Headers', 'Content-Type');
});


app.post('/sendLocation', function(request, response) {
	var login = request.body.login;
	var lat = request.body.lat;
	var lng = request.body.lng;
	var created_at = Date.now();
	if (login == undefined || lat == undefined || lng == undefined || login == "") {
		response.send({"error": "Whoops, something is wrong with your data!"});
	} else {
		var toInsert = {
			"login": login,
			"lat": Number(lat),
			"lng": Number(lng),
			"created_at": created_at
		};
		db.collection('locations', function(error1, coll) {
			var id = coll.insert(toInsert, function(error2, saved) {
				if (error2) { 
					response.send(500); 
				}
				else {
					var to_send = '';
					collection.find().toArray(function(error3, cursor) {
						if (!error3) {
							to_send += "[";
							for (var i = cursor.length; i > 0; i--) {
								to_send += JSON.stringify(cursor[i]);
								if (i > 0) {
									to_send += ",";
								}
							}
							to_send += "]";
							response.send(to_send);
						}
					});
				}
			});
		});
});

app.get('/location.json', function(request, response) {
	response.set('Content-Type', 'application/json');
	var login = request.query.login;
	var to_send = "{}";
	db.collection('locations', function(er, collection) {
		collection.find({"login" : login}).toArray(function(err, cursor) {
			if (!err) {
				to_send = JSON.stringify(cursor);
				response.send(to_send);
			} else {
				response.send(to_send);
			}
		});
	});
}）；

app.get('/', function(request, response) {
	response.set('Content-Type', 'text/html');
	var indexPage = "";
	db.collection('locations', function(er, collection) {
		collection.find().toArray(function(err, cursor) {
			if (!err) {
				indexPage += "<!DOCTYPE HTML><html><head><title>Server Log</title></head><body><h1>Who Checked in at Where on When</h1>";
				for (var count = 0; count < cursor.length; count++) {
					indexPage += "<p>" + cursor[count].login + "checked in at " + cursor[count].lat + ", " 
					+ cursor[count].lng + "on " + cursor[count].created_at + "</p>";
				}
				indexPage += "</body></html>"
				response.send(indexPage);
			} else {
				response.send('<!DOCTYPE HTML><html><head><title>Server Log</title></head><body><h1>Ugh, something went terribly wrong!</h1></body></html>');
			}
		});
	});
});

//bind-to-port-within-60-seconds
app.listen(process.env.PORT || 3000);