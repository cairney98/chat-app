const socket = io();

// extract username from url
const url = window.location.origin
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
      let item = $("<li></li>");
      let text = $("<p></p>").text($("#input").val());
      let tag = $("<p></p>").text(
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

// recieve and display messages from server
socket.on("chat message", function (msg) {
  let item = $("<li></li>");
  let text = $("<p></p>").text(msg.message);
  let tag = $("<p></p>").text(msg.username + " · " + msg.time);
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
  let item = $("<p></p>").text(data);
  let name = $("<p></p>").text(data.online);
  item.addClass("connection-message");
  $("#messages").append(item);
  $("#online").append(name);
  window.scrollTo(0, document.body.scrollHeight);
});

// update the display of online users
socket.on("online status", (users) => {
  $("#online").html("");
  users.map((user) => {
    let item = $("<li></li>");
    let name = $("<p></p>");
    let meta = $("<caption></caption>");
    if (user.name === userName) {
      name.html("<strong>" + user.name + "</strong>" + " (You)" + "<br/>");
      item.append(name);
      item.append(meta);
    } else {
      name.html("<strong>" + user.name + "</strong>" + "<br/>");
      meta.text(
        `Joined ${new Date( new Date().getTime() - user.time).getMinutes()}min ago`
      );
      item.append(name);
      item.append(meta);
    }
    $("#online").append(item);
  });
  $("#online").append($(`<a href=${url} target='_blank'>Add User</a>`));
});

socket.on("message history", (messages) => {
  console.log(messages);
  messages.map((msg) => {
    let item = $("<li></li>");
    let text = $("<p></p>").text(msg.message);
    let tag = $("<p></p>").text(msg.username + " · " + msg.time);
    item.addClass("message-container");

    if (msg.username == userName) {
      text.addClass("sent-message");
      tag.addClass("sent-name");
    } else {
      text.addClass("message");
      tag.addClass("message-name");
    }

    item.append(tag);
    item.append(text);
    $("#messages").append(item);
  });

  // $(".message-container").last()[0].scrollIntoView();
});
