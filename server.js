var ws = require('websocket-server'),
	server = ws.createServer({debug: true}),
	count = 0,
	ids = [];

server.on('connection', function(con) {
    count++;
    ids[con.id] = count;
    console.log("connection:"+con.id + " with id: "+count);
    var data = {
    	type: "welcome",
    	id: ids[con.id]
    };

    con.send(JSON.stringify(data));
    console.log("send: "+JSON.stringify(data));

    con.on('message', function(msg) {
		var message = JSON.parse(new Buffer(msg));
		if(message.type === "update") {
			console.log("do tadepole update");
		    var data = {
		    	type: "update",
		    	id: ids[con.id],
		    	angle: parseFloat(message.angle),
		    	momentum: parseFloat(message.momentum),
		    	x: parseFloat(message.x),
		    	y: parseFloat(message.y),
		    	life: 1,
		    	name: message.name,
		    	authorized: false
		    };
		    con.broadcast(JSON.stringify(data));
		    console.log(JSON.stringify(data));
		} else if(message.type === "message"){
			var data = {
			    	type: "message",
			    	id: ids[con.id],
			    	message: message.message
			};
			con.broadcast(JSON.stringify(data));
			console.log(JSON.stringify(data));
		}
    });

    con.on('close', function(){
		console.log(con.id+" closed");
		var data = {
		    type: "closed",
		    id: ids[con.id]
		};
		con.broadcast(JSON.stringify(data));
		console.log(JSON.stringify(data));
    });
});

server.on('error', function(){
    console.log(Array.prototype.join.call(arguments, ", "));
});

server.on('disconnected', function(con) {
    console.log(con.id+"discon");
});

server.listen(8181);
