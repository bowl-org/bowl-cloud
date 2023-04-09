const { Server } = require("socket.io");
require("dotenv").config();
const env = process.env;
const authTokenService = require("./authTokenService");

//Make sure same socketio instance between modules
let io;

const authSocketMiddleware = (socket, next) => {
  authTokenService
    .verifyAuthToken(socket.handshake.headers["token"])
    .then((decoded) => {
      console.log(decoded);
      next();
    })
    .catch((err) => {
      console.log("Refused socket info: ", socket.handshake);
      //If the next method is called with an Error object, the connection
      //will be refused and the client will receive an 'connect_error' event.
      next(err);
    });
};

const initSocket = (server) => {
  io = new Server(server, {
    allowEIO3: true,
    path: `${env.API_TOKEN}/socket.io`,
    cors: {
      origin: "*",
    },
  });
  //Use authentication middleware
  io.use(authSocketMiddleware);
  io.on("connection", (socket) => {
    console.log("User connected");
    socket.on("online", (data) => {
      //Data is only friend name for now
      socket.broadcast.emit("online", data);
    });
    socket.on("chatMessage", (data) => {
      console.log(data);
      socket.broadcast.emit("chatMessage", data);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
module.exports = { initSocket };
