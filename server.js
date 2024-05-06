const express = require("express");
const Socket = require("socket.io");

// server.js

// Importing required modules
const PORT = 3000;

// Creating an instance of Express app
const app = express();
const server = require("http").createServer(app);

// Creating an HTTP server using the Express app

// Creating a Socket.IO instance and configuring CORS
const io = Socket(server, {
  cors: {
    origin: "*",
    // Configuring allowed methods
    methods: ["GET", "POST"],
  },
});

// Array to store connected users
const users = [];

// Event handler for new socket connections
io.on("connection", socket => {
  
  // Event handler for adding a new user
  socket.on("adduser", username => {
    socket.user = username;
    //push or add the username to the users array
    users.push(username);
    // Emitting the updated user list to all connected clients
    io.sockets.emit("users", users);

    // Sending a private message to the newly connected user
    io.to(socket.id).emit("private", {
      id: socket.id,
      name: socket.user,
      msg: "secret message for you!",
    });
  });

  // Event handler for receiving and broadcasting messages
  /* 
socket.on("message") is employed to handle incoming chat messages from clients.
  */
  socket.on("message", message => {
    io.sockets.emit("message", {
      message,
      user: socket.user,
      id: socket.id,
    });
  });

  // Event handler for disconnecting users
  /*
socket.on("disconnect") manages disconnections 
and ensures that disconnected users are removed from the users array.
  */
  socket.on("disconnect", () => {
    console.log(`user ${socket.user} is disconnected`);
    if (socket.user) {
      users.splice(users.indexOf(socket.user), 1);
      io.sockets.emit("user", users);
      console.log("remaining users:", users);
    }
  });
});

// Starting the server and listening on the specified port
server.listen(PORT, () => {
  console.log("listening on PORT: ", PORT);
});

