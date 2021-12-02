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

// SOCKET.IO
let users = [];
io.on("connection", (socket) => {
  socket.on("user joined", (data) => {

    // update list of online users
    users.push(data);

    // send list of online users to all clients
    io.emit("online status", users);

    // only user recieves welcome message
    socket.emit("connect-message", "Welcome " + data + "!");

    // update list of online users
    socket.on("disconnect", () => {
      users = users.filter((user) => user != data);
    });
  });

  // send taken usernames to login page
socket.on("request usernames", () => {
  socket.emit("usernames", users)
})

  // send messages to every other client
  socket.on("chat message", (msg) => {
    socket.broadcast.emit("chat message", msg);
  });
});
