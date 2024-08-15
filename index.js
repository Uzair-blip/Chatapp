// const io = require("socket.io")(8000, {
//     cors: {
//         origin: "*",  // Allow requests from any origin
//     }
// });

// const users = {};  // Object to store connected users

// io.on("connection", socket => {
//     console.log("New connection established with socket ID:", socket.id);

//     // When a new user joins
//     socket.on("new-user-joined", name => {
//         console.log("New user joined:", name);  // Log the user's name
//         users[socket.id] = name;  // Store the user’s name with their socket ID
//         socket.broadcast.emit("user-joined", name);  // Notify all other users about the new user
//     });

//     // When a user sends a message
//     socket.on("send", message => {
//         console.log("Message received from", users[socket.id], ":", message);
//         socket.broadcast.emit("received", { message: message, name: users[socket.id] });  // Broadcast the message to all other users
//     });

//     // Handle user disconnection
//     socket.on("disconnect", () => {
//         socket.broadcast.emit("user-left",users[socket.id]);
//         delete users[socket.id];
//     });
// });
const io = require("socket.io")(8000, {
    cors: {
        origin: "*",  // Allow requests from any origin
    }
});

const users = {};  // Object to store connected users

io.on("connection", socket => {
    console.log("New connection established with socket ID:", socket.id);

    // When a new user joins
    socket.on("new-user-joined", name => {
        if (name && !Object.values(users).includes(name)) {  // Ensure the name is unique and not empty
            console.log("New user joined:", name);  // Log the user's name
            users[socket.id] = name;  // Store the user’s name with their socket ID
            socket.broadcast.emit("user-joined", name);  // Notify all other users about the new user
            socket.emit("auth-success", name);  // Notify the user of successful authentication
        } else {
            socket.emit("auth-failed", "Username is taken or invalid.");
        }
    });

    // When a user sends a message
    socket.on("send", message => {
        console.log("Message received from", users[socket.id], ":", message);
        socket.broadcast.emit("received", { message: message, name: users[socket.id] });  // Broadcast the message to all other users
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        if (users[socket.id]) {
            socket.broadcast.emit("user-left", users[socket.id]);
            delete users[socket.id];
        }
    });

    // Typing Indicator
    socket.on("typing", () => {
        socket.broadcast.emit("typing", users[socket.id]);
    });

    socket.on("stop-typing", () => {
        socket.broadcast.emit("stop-typing");
    });
});
