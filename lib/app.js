var PreviousTime=0;
var express = require('express'),
    app = express()  ,
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);


server.listen(4444);

// app.use("/public", express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/'));



app.get('/', function (req, res) {

    res.sendfile(__dirname + '/index.html');
    var obj = {
        tid1 : "john",
        tid2 : "krammer"
     };
    res.send(JSON.stringify(obj));

    var store = '';
    response.writeHead(200, {"Content-Type": "text/json"});
    request.on('data', function(data) {
        store += data;
    });
    request.on('end', function() {
        store = JSON.parse(store);
        console.log(store);
        response.end(store);
    });



    });         

io.sockets.on('connection', function (socket) {


    
// Room concept starts here
    function log(){
        var array = [">>> Message from server: "];
      for (var i = 0; i < arguments.length; i++) {
        array.push(arguments[i]);
      }
        socket.emit('log', array);
    }



    socket.on('create or join', function (room) {

        var numClients = io.sockets.clients(room).length;

        log('Room ' + room + ' has ' + numClients + ' client(s)');
        log('Request to create or join room', room);

        if (numClients == 0){
            socket.join(room);
            socket.emit('created', room);
        } else if (numClients == 1) {
            io.sockets.in(room).emit('join', room);
            socket.join(room);
            socket.emit('joined', room);
        }

        socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
        socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);

        socket.on('sendMessage', function (data) {
            socket.broadcast.emit('message', data);
            socket.emit('message', { text: '<strong>'+data.text+'</strong>' });   
        });

        socket.on('videoControl', function (data) {
            PreviousTime=data;
            socket.broadcast.emit('videoChanges', data);
            socket.emit('videoChanges', data);   
        });

        socket.on('videoinitial', function (data) {
            if(data!=2){
                PreviousTime="pause#0";
            }            
            socket.emit('clientInitial', PreviousTime);   
        });
        socket.on('setprevious', function (data) {
                PreviousTime=data;
        });  

    });

});

