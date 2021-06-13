require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const socketIO = require("socket.io");

require("./models/ItemDb");
require("./models/PriceDb");

const otpRoutes = require("./routes/OtpRoutes");
const itemRoutes = require("./routes/ItemRoutes");
const AdminRoutes = require("./routes/AdminRoutes");
const PriceRoutes = require("./routes/PriceRoutes");

const app = express();
const server = require("http").createServer(app);
const PORT = process.env.PORT || 5000;
const io = socketIO(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(otpRoutes);
app.use(itemRoutes);
app.use(AdminRoutes);
app.use(PriceRoutes);

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Mongodb connected successfully");
});
mongoose.connection.on("error", (err) => {
  console.log("Mongodb not connected", err);
});

io.on("connection", (socket) => {
  console.log("User Connect via Socket");

  socket.on("orderReview", (orderReview) => {
    io.emit("orderReviewDone", orderReview);
  });

  socket.on("orderDelivered", (orderDelivered) => {
    io.emit("orderDeliveredDone", orderDelivered);
  });
});

server.listen(PORT, () => {
  console.log("sever running on : " + PORT);
});
