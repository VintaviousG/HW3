// Selecting DOM elements
const messageform = document.querySelector(".chatbox form"); // Form element for sending messages
const messageList = document.querySelector("#messagelist"); // List element for displaying messages
const userList = document.querySelector("ul#users"); // List element for displaying users
const chatboxinput = document.querySelector(".chatbox input"); // Input element for typing messages

// Creating a socket connection to the server
const socket = io("http://localhost:3000");

// Initializing variables
let users = []; // Array to store user names
let messages = []; // Array to store messages
let isUser = ""; // Variable to store the current user's name

// Event listener for receiving new messages
/* 

socket.on("message", message): This event listener listens for “message” events sent by the server. 
When a “message” event is received, the message is pushed into the messages array, 
and the updateMessages function is called to update the chat message display.
*/
socket.on("message", message => {
  messages.push(message); // Adding the new message to the messages array
  updateMessages(); // Updating the displayed messages
});


/* 
socket.on("private", data): This event listener listens for “private” events. 
When a “private” event is received, the isUser variable is updated with the name of the sender.
*/
socket.on("private", data => {
  isUser = data.name; // Updating the current user's name
});

/* 
socket.on("users", function (_users)): This event listener listens for users events.
 When a users event is received, the users array is updated with the user data, 
and the updateUsers function is called to update the user list display.
*/
socket.on("users", function (_users) {
  users = _users; // Updating the users array
  updateUsers(); // Updating the displayed users
  console.log("The Users are: " +users);
});

// Event listener for submitting the message form
messageform.addEventListener("submit", messageSubmitHandler);

// Function to update the displayed users
function updateUsers() {
  userList.textContent = ""; // Clearing the user list
  for (let i = 0; i < users.length; i++) {
    var node = document.createElement("LI"); // Creating a new list item element
    var textnode = document.createTextNode(users[i]); // Creating a text node with the user's name
    node.appendChild(textnode); // Appending the text node to the list item
    userList.appendChild(node); // Appending the list item to the user list
  }
}

// Function to update the displayed messages
function updateMessages() {
  messageList.textContent = ""; // Clearing the message list
  for (let i = 0; i < messages.length; i++) {
    const show = isUser === messages[i].user ? true : false; // Checking if the message is a private message
    messageList.innerHTML += `<li class=${show ? "private" : ""}>
                     <p>${messages[i].user}</p>
                     <p>${messages[i].message}</p>
                       </li>`; // Creating HTML markup for the message and appending it to the message list
  }
}

// Function to handle message submission
function messageSubmitHandler(e) {
  e.preventDefault(); // Preventing the default form submission behavior
  let message = chatboxinput.value; // Getting the value of the input field
  socket.emit("message", message); // Emitting the message to the server
  chatboxinput.value = ""; // Clearing the input field
}

// Function to handle adding a user
function userAddHandler(user) {
  userName = user || `User-${Math.floor(Math.random() * 1000000)}`; // Generating a random user name if no name is provided
  socket.emit("adduser", userName); // Emitting the user name to the server
}

// Calling the userAddHandler function to add a user
userAddHandler();