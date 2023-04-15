const { Server } = require("socket.io");
require("dotenv").config();
const env = process.env;
const authTokenService = require("./authTokenService");
const userService = require("./userService");
// const messageBufferC

//Make sure same socketio instance between modules
let io;
let connectedUsers = {};

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
//const socketDataParserMiddleware = (socket, next) => {
//try {
//console.log("DATA PARSER TEST:",socket.data);
//next();
//} catch (err) {
//next(err);
//}
//};
//const parseSocketData = (data) => JSON.parse(data)

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

  handleConnection();
};
const handleEvents = (socket) => {
  socket.on("online", (data) => {
    //Data is only friend name for now
    socket.broadcast.emit("online", data);
  });
  socket.on("chatMessage", (data) => {
    console.log(data);
    socket.broadcast.emit("chatMessage", data);
    /*messageBufferController.sendMessage()
    .then(())
    */
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
    delete connectedUsers[socket.id];
    console.log("Connected users when disconnect triggered:", connectedUsers);
  });
  contactRequestEventHandler(socket);
  acceptContactRequestEventHandler(socket);
  declineContactRequestEventHandler(socket);
  contactRequestStatusEventHandler(socket);
};
const getEmailFromSocket = (socket) => {
  let token = socket.handshake.headers["token"];
  return authTokenService.getUserEmailFromToken(token);
};
const handleConnection = () => {
  io.on("connection", (socket) => {
    console.log("User connected");
    //socket.use(socketDataParserMiddleware);
    //let token = socket.handshake.headers["token"];
    let connectedUserEmail = getEmailFromSocket(socket);
    //Prevent multiple socket instances with same user
    if (checkUserSocketAvailability(connectedUserEmail)) {
      connectedUsers[connectedUserEmail].disconnect();
    }
    connectedUsers[connectedUserEmail] = socket;
    //console.log("Connected users:", connectedUsers);
    //buffer check
    //contact requests
    //contactBuffer
    //socket.emit("contactRequestReceived", senderData);
    handleEvents(socket);
  });
};
const contactRequestStatusEventHandler = async (socket) => {
  socket.on("contactRequestStatus", async (data, callback) => {
    data = JSON.parse(data);
    let statusUser = userService.getUserByEmail(getEmailFromSocket(socket));
    let contactRequestSender = userService.getUserByEmail(data.email);
    let status = data.status;
    if (status == "ACCEPT") {
      connectedUsers[contactRequestSender.id].emit("contactRequestStatus", {
        ...statusUser,
        status: status,
      });
    } else {
      connectedUsers[contactRequestSender.id].emit("contactRequestStatus", {
        status: status,
      });
    }
    //console.log("DATA ACCEPT:", data)
    //console.log(
    //"Accept contact request:",
    //"From: ",
    //socketUserEmail,
    //"To: ",
    //JSON.parse(data)?.email
    //);
  });
};
const acceptContactRequestEventHandler = async (socket) => {
  socket.on("acceptContactRequest", async (data, callback) => {
    let socketUserEmail = getEmailFromSocket(socket);
    console.log("DATA ACCEPT:", data);
    console.log(
      "Accept contact request:",
      "From: ",
      socketUserEmail,
      "To: ",
      JSON.parse(data)?.email
    );
  });
};
const declineContactRequestEventHandler = async (socket) => {
  socket.on("declineContactRequest", async (data, callback) => {
    let socketUserEmail = getEmailFromSocket(socket);
    console.log(
      "Decline contact request:",
      "From: ",
      socketUserEmail,
      "To: ",
      data.email
    );
  });
};
const contactRequestEventHandler = async (socket) => {
  socket.on("sendContactRequest", async (data, callback) => {
    let socketUserEmail = getEmailFromSocket(socket);
    let contactEmail = JSON.parse(data).email;
    console.log(contactEmail);
    //let contactEmail = data.email;
    try {
      //Check user is exists or not
      await userService.getUserByEmail(contactEmail);
      if (!checkUserSocketAvailability(contactEmail))
        throw new Error("User not available!");
      let senderUser = await userService.getUserByEmail(socketUserEmail);
      let senderData = {
        name: senderUser.name,
        email: senderUser.email,
        publicKey: senderUser.public_key,
      };
      connectedUsers[contactEmail].emit("contactRequestReceived", senderData);
      console.log(
        "Contact request sent:",
        "From: ",
        senderData,
        "To: ",
        contactEmail
      );
      callback({
        status: "OK",
      });
    } catch (err) {
      callback({
        status: "ERROR",
        error: err.message,
      });
    }
  });
};
const checkUserSocketAvailability = (email) =>
  connectedUsers.hasOwnProperty(email);
module.exports = {
  initSocket,
  checkUserSocketAvailability,
};
