const express = require("express");
const app = express();
const connectDB = require("./migrations/index.js");
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fs = require("fs");

const UPLOADS_DIR = "./uploads";

// Check if the uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  // If it doesn't exist, create the directory
  fs.mkdirSync(UPLOADS_DIR);
  console.log("Folder Created");
} else {
  console.log("Folder Exist");
}

const { routes } = require("./routes/main");

// Registers routes
routes({ app, io });

app.get("/", (req, res) => {
  res.send("Server Running");
});

//db connect
connectDB();

const port = process.env.ACCESS_PORT || 5900;

server.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
