const login = document.getElementById("login");
const input = document.getElementById("username-input");
const warning = document.getElementById("warning");

// set username constraints
login.addEventListener("submit", (e) => {
  warning.innerText = "";
  if (input.value.length < 3 || input.value.length > 10) {
    e.preventDefault();
    warning.innerText = "Username must be 3-10 characters.";
  }
});
