const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const env = process.env;
const http = require("http");
const server = http.createServer(app);
const socketHandlerService = require("./services/socketHandlerService");
//${Username}:${Password}@host:port/db_name
const DB_URL = `mongodb://${env.DB_ROOT_USERNAME}:${env.DB_ROOT_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/`;
const connect = mongoose.connect(DB_URL);
const HTTP_PORT = env.HTTP_PORT;
//DEV
const reload = require("reload");

const logInRouter = require("./routes/logInRouter");
const signUpRouter = require("./routes/signUpRouter");
const forgotPasswordRouter = require("./routes/forgotPasswordRouter");
const verifyRouter = require("./routes/verifyRouter");
const userRouter = require("./routes/userRouter");
const privateChatRouter = require("./routes/privateChatRouter");

// We will not pass endpoint from nginx, api key will be handled in nginx side
//const wss = new WebSocket.Server({ server: server }, () => {
//console.log(`WS server is binded to http server`);
//});
connect
  .then((db) => {
    console.log("Connected to DB successfully");
  })
  .catch((err) => console.log(err));

//Middlewares
//Express body parser
app.use(express.json()); //req.body
app.use(cors());
//View engine
app.set("view engine", "ejs");
//Sign up router mounted as /signup
app.use(`${env.API_TOKEN}/signup`, signUpRouter);
//Log in router mounted as /login
app.use(`${env.API_TOKEN}/login`, logInRouter);
//Forgot password router mounted as /forgotpassword
app.use(`${env.API_TOKEN}/forgotpassword`, forgotPasswordRouter);
//Verification router mounted as /verify
app.use(`${env.API_TOKEN}/verify`, verifyRouter);
// User router mounted as /user
app.use(`${env.API_TOKEN}/user`, userRouter);
// Private chat router mounted as /privateChat
app.use(`${env.API_TOKEN}/privateChat`, privateChatRouter);
app.get("/", (req, res) => {
  res.send("<h1>Bowl Backend</h1>");
});
app.get(`${env.API_TOKEN}`, (req, res) => {
  res.send("<h1>Bowl Backend With API token</h1>");
});
//Init socketio
socketHandlerService.initSocket(server);

server.listen(HTTP_PORT, () => {
  console.log(`http and socket.io server listening on ${HTTP_PORT}`);
});
//DEV
reload(app);
