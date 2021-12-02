const socket = io();

const login = document.getElementById("login");
const input = document.getElementById("username-input");
const warning = document.getElementById("warning");

let users = [];

// get current usernames
socket.emit("request usernames");
socket.on("usernames", (data) => {
  users = data;
});

// set username constraints
login.addEventListener("submit", (e) => {
  warning.innerText = "";
  if (input.value.length < 3 || input.value.length > 10) {
    e.preventDefault();
    warning.innerText = "Username must be 3-10 characters.";
  } else if (users.some((user) => user === input.value)) {
    e.preventDefault();
    warning.innerText = "Username taken, try another.";
  }
});
