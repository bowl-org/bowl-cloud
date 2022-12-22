const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const DB_URL = "mongodb://127.0.0.1:27017/p2p_chat"
const connect = mongoose.connect(DB_URL);
const HTTP_PORT = 3000;
const getTimestamp = () => {
  let d = new Date();
  return (
    "[ " +
    d.toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul" }) +
    " - " +
    d.toLocaleTimeString("tr-TR", { timeZone: "Europe/Istanbul" }) +
    " ] "
  );
};
// We will not pass endpoint from nginx, api key will be handled in nginx side
//const wss = new WebSocket.Server({ server: server }, () => {
  //console.log(`WS server is binded to http server`);
//});
connect.then((db) => {
	console.log('Connected to DB successfully');
}).catch((err) => console.log(err));

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
  socket.on("online", (data) => {
    //Data is only friend name for now
    socket.broadcast.emit('online', data);
  });
  socket.on("chatMessage", (data) => {
    socket.broadcast.emit('chatMessage', data);
    console.log(data);
  });
  socket.on('disconnect', ()=>{
    console.log('User disconnected')
  })
});

server.listen(HTTP_PORT, () => {
  console.log(`http and ws server listening on ${HTTP_PORT}`);
});
