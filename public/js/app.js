const socket = io();

// extract username from url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userName = urlParams.get("username");

// send username to server
socket.emit("user joined", userName);

// send messages to server
$(document).ready(function () {
  $("#input-bar").submit((e) => {
    e.preventDefault();
    if ($("#input").val()) {
      socket.emit("chat message", {
        message: $("#input").val(),
        username: userName,
        time: new Date().toLocaleTimeString().substr(0, 5),
      });

      // display messages sent by user
      const item = $("<li></li>");
      const text = $("<p></p>").text($("#input").val());
      const tag = $("<p></p>").text(
        "You · " + new Date().toLocaleTimeString().substr(0, 5)
      );
      $("#input").val("");
      item.addClass("message-container");
      text.addClass("sent-message");
      tag.addClass("sent-name");
      item.append(tag);
      item.append(text);
      $("#messages").append(item);
      $(".message-container").last()[0].scrollIntoView();
    }
  });
});

// recieve and display messages sent by other users
socket.on("chat message", function (msg) {
  const item = $("<li></li>");
  const text = $("<p></p>").text(msg.message);
  const tag = $("<p></p>").text(msg.username + " · " + msg.time);
  item.addClass("message-container");
  text.addClass("message");
  tag.addClass("message-name");
  item.append(tag);
  item.append(text);
  $("#messages").append(item);
  $(".message-container").last()[0].scrollIntoView();
});

// recieve connection messages
socket.on("connect-message", (data) => {
  const item = $("<p></p>").text(data);
  const name = $("<p></p>").text(data.online);
  item.addClass("connection-message");
  $("#messages").append(item);
  $("#online").append(name);
  window.scrollTo(0, document.body.scrollHeight);
});

// update the display of online users
socket.on("online status", (users) => {
  $("#online").html("");
  users.map((user) => {
    const item = $("<li></li>");
    const name = $("<p></p>");
    const meta = $("<caption></caption>");
    if (user === userName) {
      name.html("<strong>" + user + "</strong>" + " (You)");
      item.append(name);
    } else {
      name.html("<strong>" + user + "</strong>" + "<br/>");
      meta.text("Joined 1min ago");
      item.append(name);
      item.append(meta);
    }
    $("#online").append(item);
  });
});
