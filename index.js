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
//存储访问者的统计信息
var visitorsData = {};

app.set('port', (process.env.PORT || 5000));

// 静态化文件
app.use(express.static(path.join(__dirname, 'public/')));

// 设置测试页的路由：
//    1. /
//    2. /about
//    3. /contact
app.get(/\/(about|contact)?$/, function(req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

// 设置控制台页面的路由
app.get('/dashboard', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/dashboard.html'));
});

io.on('connection', function(socket) {
  if (socket.handshake.headers.host === config.host
	&& socket.handshake.headers.referer.indexOf(config.host + config.dashboardEndpoint) > -1) {

	  // 刚进来时，发送一遍统计信息
	  io.emit('updated-stats', Util.computeStats(visitorsData));

	}

	// 来客人啦，接客啦~~~
	socket.on('visitor-data', function(data) {
	  visitorsData[socket.id] = data;

	  // 更新统计数据
	  io.emit('updated-stats', Util.computeStats(visitorsData));
	});

	socket.on('disconnect', function() {
	  // 用户离开页面了，删除对应信息
	  delete visitorsData[socket.id];

	  // 更新统计数据
	  io.emit('updated-stats', Util.computeStats(visitorsData));
	});
});

http.listen(app.get('port'), function() {
  console.log('listening on port:' + app.get('port'));
});