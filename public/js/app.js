const socket = io();

// create dom elements
const messages = document.getElementById("messages");
const online = document.getElementById("online");
const form = document.getElementById("input-bar");
const input = document.getElementById("input");

// extract username from url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const userName = urlParams.get("username");

// send username to server
socket.emit("user joined", userName);

// send messages to server
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", { message: input.value, username: userName, time: new Date().toLocaleTimeString().substr(0,5)  });

    // display messages sent by user
    const item = document.createElement("li");
    const text = document.createElement("p");
    const tag = document.createElement("p");
    item.classList.add("message-container");
    text.classList.add("sent-message");
    tag.classList.add("sent-name");
    text.textContent = input.value;
    tag.textContent = "You · " + new Date().toLocaleTimeString().substr(0,5);
    item.appendChild(tag);
    item.appendChild(text);
    messages.appendChild(item);
    item.scrollIntoView();

    // reset input text when sent
    input.value = "";
  }
});

// recieve and display messages sent by other users
socket.on("chat message", function (msg) {
  const item = document.createElement("li");
  const tag = document.createElement("p");
  const text = document.createElement("p");
  item.classList.add("message-container");
  tag.classList.add("message-name");
  text.classList.add("message");
  text.textContent = msg.message;
  tag.textContent = msg.username + " · " + msg.time;
  item.appendChild(tag);
  item.appendChild(text);
  messages.appendChild(item);
  item.scrollIntoView();
});

// recieve connection messages
socket.on("connect-message", (data) => {
  const item = document.createElement("p");
  const name = document.createElement("p");
  item.classList.add("connection-message");
  item.textContent = data;
  name.textContent = data.online;
  messages.appendChild(item);
  online.appendChild(name);
  window.scrollTo(0, document.body.scrollHeight);
});

// update the display of online users
socket.on("online status", (users) => {
  online.innerHTML = "";
  users.map((user) => {
    const item = document.createElement("li");
    const name = document.createElement("p");
    const meta = document.createElement("caption");
    if (user === userName) {
      name.innerHTML = "<strong>" + user + "</strong>" + " (You)" ;
      item.appendChild(name)
    } else {
      name.innerHTML = "<strong>" + user + "</strong>" + "<br/>" ;
      meta.innerText = "Joined 1min ago";
      item.appendChild(name)
      item.appendChild(meta);
    }

    online.appendChild(item);
  });
});
