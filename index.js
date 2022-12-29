const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const env = process.env;
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
//${Username}:${Password}@host:port/db_name
const DB_URL = `mongodb://${env.DB_ROOT_USERNAME}:${env.DB_ROOT_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/`
const connect = mongoose.connect(DB_URL);
const HTTP_PORT = 3000;

const logInRouter = require("./routes/logInRouter")
const signUpRouter = require("./routes/signUpRouter")
const forgotPasswordRouter = require("./routes/forgotPasswordRouter")
//const verifyRouter = require("./routes/verifyRouter")

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

//Middlewares
//Express body parser
app.use(express.json())//req.body
//Sign up router mounted as /signup
app.use('/signup', signUpRouter);
//Log in router mounted as /login
app.use('/login', logInRouter);
//Forgot password router mounted as /forgotpassword
app.use('/forgotpassword', forgotPasswordRouter);
//Verification router mounted as /verify
//app.use('/verify', verifyRouter);
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
