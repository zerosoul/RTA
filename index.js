var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var Util = require('./Util.js');

var config = {
    host: "localhost:"+(process.env.PORT || 5000),
    dashboardEndpoint: "/dashboard"
};
// the object that will hold information about the active users currently
// on the site
var visitorsData = {};

app.set('port', (process.env.PORT || 5000));

// serve the static assets (js/dashboard.js and css/dashboard.css)
// from the public/ directory
app.use(express.static(path.join(__dirname, 'public/')));

// serve the index.html page when someone visits any of the following endpoints:
//    1. /
//    2. /about
//    3. /contact
app.get(/\/(about|contact)?$/, function(req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

// serve up the dashboard when someone visits /dashboard
app.get('/dashboard', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/dashboard.html'));
});

io.on('connection', function(socket) {
  if (socket.handshake.headers.host === config.host
	&& socket.handshake.headers.referer.indexOf(config.host + config.dashboardEndpoint) > -1) {

	  // if someone visits '/dashboard' send them the computed visitor data
	  io.emit('updated-stats', Util.computeStats(visitorsData));

	}

	// a user has visited our page - add them to the visitorsData object
	socket.on('visitor-data', function(data) {
	  visitorsData[socket.id] = data;

	  // compute and send visitor data to the dashboard when a new user visits our page
	  io.emit('updated-stats', Util.computeStats(visitorsData));
	});

	socket.on('disconnect', function() {
	  // a user has left our page - remove them from the visitorsData object
	  delete visitorsData[socket.id];

	  // compute and send visitor data to the dashboard when a user leaves our page
	  io.emit('updated-stats', Util.computeStats(visitorsData));
	});
});

http.listen(app.get('port'), function() {
  console.log('listening on port:' + app.get('port'));
});