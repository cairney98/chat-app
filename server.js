const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// serve static pages
app.use(express.static("public/css"));
app.use(express.static("public/js"));

// get login home page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// get chat page
app.get("/chat.html", (req, res) => {
  res.sendFile(__dirname + "/public/chat.html");
});

// set port for heroku server and local server
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
//

// ======== SOCKET.IO ======== //
let users = [];
let messages = [];
let online = false;
io.on("connection", (socket) => {
  socket.on("user joined", (username) => {
    // update list of online users
    if (users.some((user) => user.name == username)) {
    } else {
      users.push({
        name: username,
        time: new Date().getTime(),
      });
    }

    
    // send list of online users to all clients
    io.emit("online status", users);

    // only user recieves welcome message
    socket.emit("connect-message", "Welcome " + username + "!");

    // display all messages sent prior to connection
    socket.emit("message history", messages);

    // remove user when they leave and reset all messages if all users disconnect
    socket.on("disconnect", () => {
      users = users.filter((user) => user.name != username);

      setTimeout(() => {
        if (users.length === 0) {
          messages = [];
        }
      }, 1000);
    });
  });

  // send taken usernames to login page
  socket.on("request usernames", () => {
    socket.emit("usernames", users);
  });

  // send messages to every other client
  socket.on("chat message", (msg) => {
    messages.push(msg);
    socket.broadcast.emit("chat message", msg);
  });
});
