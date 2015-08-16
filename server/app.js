
var app = require("http").createServer(handler),
		io = require("socket.io").listen(app),
		fs = require("fs");

app.listen(1337);
console.log("server listening ...");

var model = []; //chat log

function handler(req, res){
	res.writeHead(200, {"Content-Type":"text/plain"});
	res.end("connected");
}

io.sockets.on("connection", function(socket){
	
	console.log("connection emit");

	socket.on("login", function(){
		console.log("login");
		io.to(socket.id).emit("init", {model: model, id: socket.id});
	});
	
	socket.on("pushMessage", function(data){
		model.push(data);
		io.sockets.emit("reloadMessage", model);
	});

});

