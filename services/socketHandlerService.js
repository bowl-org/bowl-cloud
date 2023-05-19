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
  // onlineHandler(socket);
  disconnectHandler(socket);
  contactChatMessageHandler(socket);
  groupChatMessageHandler(socket);
  globalChatMessageHandler(socket);
  contactRequestEventHandler(socket);
  acceptContactRequestEventHandler(socket);
  declineContactRequestEventHandler(socket);
  contactRequestStatusEventHandler(socket);
};
const disconnectHandler = (socket) => {
  socket.on("disconnect", async () => {
    let userEmail = getEmailFromSocket(socket);
    let userId = await userService.getIdByEmail(userEmail);
    await emitToContacts(userId, "offline", { email: userEmail });
    await emitToGroups(userId, "offline", { email: userEmail });
    delete connectedUsers[userEmail];
    console.log(userEmail, "disconnected!");
  });
};
const emitToContacts = async (userId, eventName, payload) => {
  let contactChatEmails = await privateChatService.getContactEmails(userId);
  //Send online message to all contacts
  contactChatEmails
    ?.filter((email) => isOnline(email))
    ?.forEach((email) => {
      connectedUsers[email].emit(eventName, payload);
    });
};
const emitToGroups = async (userId, eventName, payload) => {
  //TODO
};
const onlineEmitter = async (socket) => {
  let userEmail = getEmailFromSocket(socket);
  let userId = await userService.getIdByEmail(userEmail);
  await emitToContacts(userId, "online", { email: userEmail });
  await emitToGroups(userId, "online", { email: userEmail });
};
const getOnlineContactEmails = async (userId) => {
  return (await privateChatService.getContactEmails(userId))?.filter((email) =>
    isOnline(email)
  );
};
const getOnlineChats = async (userId) => {
  let onlineContactEmails = await getOnlineContactEmails(userId);
  //TODO groups
  return { contacts: onlineContactEmails, groups: [] };
};
const groupChatMessageHandler = (socket) => {
  socket.on("groupChatMessage", async (data, callback) => {
    //TODO
  });
};
const contactChatMessageHandler = (socket) => {
  socket.on("contactChatMessage", async (data, callback) => {
    try {
      data = JSON.parse(data);
      console.log("contactChatMessage:", data);
      let senderEmail = getEmailFromSocket(socket);
      let contactEmail = data.to;
      let contactSocket = connectedUsers[contactEmail];
      if (contactSocket == null) throw new Error("Contact is not online!");
      delete data.to;
      contactSocket.emit(
        "contactChatMessage",
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
const globalChatMessageHandler = (socket) => {
  socket.on("globalChatMessage", (data) => {
    socket.broadcast.emit("globalChatMessage", data);
    //TODO
    /*messageBufferController.sendMessage()
    .then(())
    */
  });
};
const getEmailFromSocket = (socket) => {
  let token = socket.handshake.headers["token"];
  return authTokenService.getUserEmailFromToken(token);
};
const emitChatsToUser = async (socket) => {
  let userEmail = getEmailFromSocket(socket);
  let userId = await userService.getIdByEmail(userEmail);
  //Return online chats data to user
  socket.emit("onlineChats", await getOnlineChats(userId));
};
const handleConnection = () => {
  io.on("connection", async (socket) => {
    console.log("User connected");
    //socket.use(socketDataParserMiddleware);
    //let token = socket.handshake.headers["token"];
    let connectedUserEmail = getEmailFromSocket(socket);
    //Prevent multiple socket instances with same user
    if (isOnline(connectedUserEmail)) {
      connectedUsers[connectedUserEmail].disconnect();
    }
    connectedUsers[connectedUserEmail] = socket;
    handleEvents(socket);
    //Send online message to chats
    await onlineEmitter(socket);
    //Send online chats to user
    await emitChatsToUser(socket);
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
    //Emit online messages if contact is online
    if (isOnline(contactEmail)) {
      //Notify contact that user become online
      connectedUsers[contactEmail].emit("online", { email: socketUserEmail });
      //Notify user that contact become online
      connectedUsers[socketUserEmail].emit("online", { email: contactEmail });
    }
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
      if (!isOnline(contactEmail)) throw new Error("User not available!");
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
      if (!privateChatService.isPrivateChatExists(privateChatData)){
        await privateChatService.insert(privateChatData);
      }else{
        console.log("Private chat duplication detected:", privateChatData);
      }
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
const isOnline = (email) => connectedUsers.hasOwnProperty(email);
module.exports = {
  initSocket,
  isOnline,
};
