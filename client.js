// const socket = io("http://localhost:8000");

// socket.on('connect', () => {
//     console.log("Connected to server with ID:", socket.id);
// });
// var audio=new Audio("ting.mp3")
// const form = document.getElementById("chat-form");
// const msgInput = document.getElementById("chat-input");
// const messageContainer = document.querySelector(".container");

// let name= prompt("Enter your name");
// socket.emit("new-user-joined", name);

// // Listening for other users joining
// socket.on("user-joined", name => {
//     console.log(`${name} joined the chat`);
//     const messageElement = document.createElement('div');
//     messageElement.classList.add('message', 'right');
//     messageContainer.append(messageElement);
//     messageElement.innerText = `${name} joined the chat`;
//     audio.play()
// });
// socket.on("received", data => {
//     console.log(`${data.name}: ${data.message}`);
//     const messageElement = document.createElement('div');
//     messageElement.classList.add('message', 'left');
//     messageElement.innerText = `${data.name}: ${data.message}`;
//     messageContainer.append(messageElement);
//     audio.play()
// });
// socket.on("user-left", name => {
//     console.log(`${name} left the chat`);
//     const messageElement = document.createElement('div');
//     messageElement.classList.add('message', 'left');
//     messageElement.innerText = `${name} left the chat`;
//     messageContainer.append(messageElement);
//     audio.play()
// });

// form.addEventListener("submit", e => {
//     e.preventDefault();
//     const message = msgInput.value;
//     const messageElement = document.createElement('div');
//     messageElement.classList.add('message', 'right');
//     messageElement.innerText = `You: ${message}`;
//     messageContainer.append(messageElement);
//     socket.emit("send", message);  // Send the message to the server
//     msgInput.value = '';  // Clear the input field
// });

const socket = io("http://localhost:8000");
var audio=new Audio("ting.mp3")
let name;
const form = document.getElementById("chat-form");
const msgInput = document.getElementById("chat-input");
const messageContainer = document.querySelector(".container");
const typingElement = document.createElement('div');  // For typing indicator
typingElement.id = "typing";
typingElement.style.display = "none";
messageContainer.appendChild(typingElement);

// Ask for the username until it's valid
do {
    name = prompt("Enter your name");
    socket.emit("new-user-joined", name);
} while (!name);

socket.on('connect', () => {
    console.log("Connected to server with ID:", socket.id);
});

// Handling authentication success
socket.on("auth-success", username => {
    console.log(`Welcome ${username}`);
});

// Handling authentication failure
socket.on("auth-failed", message => {
    alert(message);
    name = prompt("Enter a different name");
    socket.emit("new-user-joined", name);
});

// Listening for other users joining
socket.on("user-joined", name => {
    console.log(`${name} joined the chat`);
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'right');
    messageContainer.append(messageElement);
    messageElement.innerText = `${name} joined the chat`;
    audio.play();
});

// Typing indicator handling
msgInput.addEventListener("keypress", () => {
    socket.emit("typing");
});

msgInput.addEventListener("keyup", () => {
    setTimeout(() => {
        socket.emit("stop-typing");
    }, 1000);
});

socket.on("typing", name => {
    typingElement.innerText = `${name} is typing...`;
    typingElement.style.display = "block";
});

socket.on("stop-typing", () => {
    typingElement.style.display = "none";
});

// Handling received messages
socket.on("received", data => {
    console.log(`${data.name}: ${data.message}`);
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'left');
    messageElement.innerText = `${data.name}: ${data.message}`;
    messageContainer.append(messageElement);
    audio.play();
});

// Handling users leaving
socket.on("user-left", name => {
    console.log(`${name} left the chat`);
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'left');
    messageElement.innerText = `${name} left the chat`;
    messageContainer.append(messageElement);
    audio.play();
});

// Form submission handler
form.addEventListener("submit", e => {
    e.preventDefault();
    const message = msgInput.value;
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'right');
    messageElement.innerText = `You: ${message}`;
    messageContainer.append(messageElement);
    socket.emit("send", message);  // Send the message to the server
    msgInput.value = '';  // Clear the input field
});
