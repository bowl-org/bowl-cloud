const { Server } = require("socket.io");
require("dotenv").config();
const env = process.env;
const authTokenService = require("./authTokenService");
const userService = require("./userService");
const privateChatService = require("./privateChatService");
const { mapToUserDTO } = require("../models/dtos/userDto");
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
  socket.on("disconnect", () => {
    console.log("User disconnected");
    let userEmail = getEmailFromSocket(socket);
    delete connectedUsers[userEmail];
    console.log(userEmail, " disconnected!" );
  });
  onlineHandler(socket);
  chatMessageHandler(socket);
  globalMessageHandler(socket);
  contactRequestEventHandler(socket);
  acceptContactRequestEventHandler(socket);
  declineContactRequestEventHandler(socket);
  contactRequestStatusEventHandler(socket);
};
const onlineHandler = (socket) => {
  socket.on("online", async (data) => {
    //data
    //{privateChatEmails:[], groupKeyHashes:[]}
    let userEmail = getEmailFromSocket(socket);
    let userId = await userService.getIdByEmail(userEmail);
    let contactChatEmails = await privateChatService.getContactEmails(userId);
    //Send online message to all contacts
    contactChatEmails
      ?.filter((email) => connectedUsers.hasOwnProperty(email))
      ?.forEach((email) => {
        connectedUsers[email].emit("online", { email: userEmail });
      });
    //TODO group chats
    // socket.broadcast.emit("online", data);
  });
}
const chatMessageHandler = (socket) => {
  socket.on("chatMessage", async (data, callback) => {
    try {
      data = JSON.parse(data);
      let senderEmail = getEmailFromSocket(socket);
      let contactEmail = data.to;
      let contactSocket = connectedUsers[contactEmail];
      if (contactSocket == null) throw new Error("Contact is not online!");
      delete data.to;
      contactSocket.emit(
        "chatMessage",
        JSON.stringify({ ...data, from: senderEmail })
      );
      if (typeof callback === "function")
        callback({
          status: "OK",
        });
    } catch (err) {
      console.log(err.message);
      if (typeof callback === "function")
        callback({
          status: "ERROR",
          error: err.message,
        });
    }
  });
};
const globalMessageHandler = (socket) => {
  socket.on("globalMessage", (data) => {
    socket.broadcast.emit("globalMessage", data);
    /*messageBufferController.sendMessage()
    .then(())
    */
  });
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
    console.log(
      "Contact request status",
      "Status User: ",
      statusUser,
      "Contact Request Sender: ",
      contactRequestSender
    );
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
    let contactEmail = JSON.parse(data)?.email;
    console.log("DATA ACCEPT:", data);
    console.log(
      "Accept contact request:",
      "From: ",
      socketUserEmail,
      "To: ",
      contactEmail
    );
    let privateChat = await privateChatService.findByUsersIds(
      await userService.getIdByEmail(socketUserEmail),
      await userService.getIdByEmail(contactEmail)
    );
    await privateChatService.setActive(privateChat._id, true);
  });
};
const declineContactRequestEventHandler = async (socket) => {
  socket.on("declineContactRequest", async (data, callback) => {
    let socketUserEmail = getEmailFromSocket(socket);
    let contactEmail = JSON.parse(data)?.email;
    console.log(
      "Decline contact request:",
      "From: ",
      socketUserEmail,
      "To: ",
      contactEmail
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
      let contactUser = await userService.getUserByEmail(contactEmail);
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
      let privateChatData = {
        user1Id: await userService.getIdByEmail(socketUserEmail),
        user2Id: await userService.getIdByEmail(contactEmail),
        active: false,
      };
      //TODO check duplication
      await privateChatService.insert(privateChatData);
      if (typeof callback === "function")
        callback({
          status: "OK",
          contactData: {
            name: contactUser.name,
            email: contactUser.email,
            publicKey: contactUser.public_key,
          },
        });
    } catch (err) {
      if (typeof callback === "function")
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
