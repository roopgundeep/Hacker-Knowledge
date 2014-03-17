var app = require('http').createServer(handler)
  , io = require('socket.io')
  , fs = require('fs')

app.listen(8000);

function handler (req, res) {
  fs.readFile(__dirname + '../static/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}
var socket = io.listen(app);

socket.sockets.on("connection", function(client){
  console.log('Connected!');

  client.on("message", function(msg){
//    console.log("Arrived Message from Client!",msg);
  //  client.send("I got  : "+msg);
  });

  client.on("setId", function(msg){
//    console.log("Arrived Message from Client!",msg);
    client.broadcast.emit('users_count', msg);
  });


  client.on("disconnect", function() {
    console.log("Client Disconnected!");
  });
});
