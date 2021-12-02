const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// SERVER STATIC CONTENT
app.use(express.static("public/css"));
app.use(express.static("public/js"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/chat.html", (req, res) => {
  res.sendFile(__dirname + "/public/chat.html");
});

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
    users.push(data)

    // send list of online users to the client
    io.emit("online status", users);
   
    // only user recieves welcome message
    socket.emit("connect-message", "Welcome " + data + "!");

    // update list of online users
    socket.on("disconnect", () => {
      users = users.filter(user => user != data)
    });
  });

  // send user messages to all clients
  socket.on("chat message", (msg) => {
    socket.broadcast.emit("chat message", msg);
  });
});
