var net = require('net')
var sockets = [];

var server = net.createServer(function(socket){
  var s = socket;

  function broadcastData(d) {
    for(i in sockets) {
        sockets[i].write(d + "\r\n");  
    }
  }

  console.log('Someone connected...');
  sockets.push(socket);

  socket.write('Wot yo user name bro?:..> ')
  socket.on('data', initChat);

  function initChat(d) {
    socket.removeListener('data', initChat);

    socket.username = d.toString().replace(/(\n|\r)+$/, '');
    broadcastData("Server: Hey everyone make fun of " + socket.username);

    socket.on('data', function(d) {
      d.toString().replace(/(\n|\r)+$/, '');
      broadcastData(socket.username + "> " + d);
    });

    socket.on('end', function() {
      delete sockets[sockets.indexOf(socket)];
      broadcastData("Server: " + socket.username + " peaced out. ");
      console.log(socket.username + " disconnected.");
    });
  }

});

server.listen(8888, function(){
  console.log('Server listening on 8888...');
});
