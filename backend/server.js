const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

//socket

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userIo = io.of("/user");
const videoChatIo = io.of("/videoChat");

require("./socket/conversation")(io);
require("./socket/user")(userIo);
require("./socket/videoChat")(videoChatIo);

//db
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("connected to port" + process.env.PORT))
  .catch((err) => console.log(`ERROR`, err));

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`server is running on port ${port}`));

module.exports = io;
