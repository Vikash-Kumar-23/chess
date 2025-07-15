const express = require("express");
const socket = require("socket.io");
const http = require("http");
const {Chess} = require("chess.js");
const path = require("path");

// Initialize Express application
const app = express();
// Create an HTTP server using the Express app
const server = http.createServer(app);
// Attach Socket.IO to the HTTP server for real-time communication
const io = socket(server);

// Initialize a new chess game instance
const chess = new Chess();
// Object to store connected players
let players = {};
// Current player, 'w' for White, 'b' for Black
let currentPlayer = "w";

// Set the view engine to EJS
app.set("view engine", "ejs");
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Define a route for the root URL
app.get("/", (req, res) => {
  // Render the 'index' view when accessing the root URL
  res.render("index");
});

io.on("connection",function(uniquesocket){
  console.log("A user connected");

  if(!players.white){
    players.white = uniquesocket.id;
    uniquesocket.emit("platerRole","w");
  }
  else if (!players.black){
    players.black = uniquesocket.id;
    uniquesocket.emit("platerRole","b");
  }
  else{
    uniquesocket.emit("spectatorRole");
  }

  uniquesocket.on("disconnect",function(){
    if (uniquesocket.id === players.white){
      delete players.white;
    }
    else if (uniquesocket.id === players.black){
      delete players.black;
    }
    else{
      delete players.spectator;
    }
    console.log("A user disconnected");
  });

  uniquesocket.on("move", (move)=>{
    try{
      if (chess.turn === 'w' && uniquesocket.id !== players.white){
        return;
      }
      if (chess.turn === 'b' && uniquesocket.id !== players.black){
        return;
      }
      const result = chess.move(move);
      if (result){
        currentPlayer = chess.move(move);
        io.emit("move", move);
        io.emit("boardState",chess.fen())
      }
      else{
        console.log("invalidMove", move);
        uniquesocket.emit("invalidMove", move);
      }
    }
    catch(err){
      console.log(err);
      uniquesocket.emit("invalidMove", move);
    }
  })
})

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});