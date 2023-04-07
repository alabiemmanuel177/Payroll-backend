const express = require("express");
const app = express();
const connectDB = require("./migrations/index.js");
const cors = require("cors");
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = ["http://localhost:3000", "http://example.com"];

// Middleware to implement CORS with specific origins
const corsMiddleware = function (req, res, next) {
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) !== -1) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
};

// Apply middleware to all routes
app.use(corsMiddleware);

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
