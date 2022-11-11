const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("<h1>P2P Chat Backend</h1>");
});
io.on('connection', (socket) => {
  console.log("User connected");
  socket.broadcast.emit('online');
  socket.on("chatMessage", (data) => {
    socket.broadcast.emit('chatMessage', data);
    console.log(data);
  });
  socket.on('disconnect', ()=>{
    console.log('User disconnected')
  })
});

server.listen(3000, () => {
  console.log("Listening on port http://localhost:3000");
});
