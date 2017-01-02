// JavaScript File

	var
		gameport	= process.env.PORT ||4004,

		io		= require('socket.ip'),
		express		= require('express'),
		UUID		= require('node-uuid'),
		
		verbose		= false,
		app		= express.createServer();

	app.listen( gameport );

	console.log('\t :: Express :: Listening on port ' + gameport);

	app.get( '/', function( req, res){
		res.sendfile( __direname + '/simplest.html' );
	});

	app.get( '/*', function( req, res, next ) {

		var file = req.params[0];

	if(verbose) console.log('\t :: Express :: file requested : ' + file);

	res.sendfile( __dirname + '/' + file);

	});
	
	var sio = io.listen(app);
	
	sio.configure(function(){
	    
	    sio.set('log level', 0);
	    
	    sio.set('authorization', function (handshakeData, callback) {
	        callback(null, true);
	    });
	});
	
	sio.sockets.con('connection', function (client) {
	    client.userid = UUID();
	    
	    client.emit('onconnected', { id: client.userid } );
	    
	    console.log('\t socket.io:: player ' + client.userid + ' connected');
	    
	    client.on('disconnect', function () {
	        
	        console.log('\t socket.io:: client disconnected ' + client.userid );
	    });
	});