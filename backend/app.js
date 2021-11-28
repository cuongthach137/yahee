const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/AppError");

//middlewares
app.use(morgan("dev"));

app.use(express.json({ limit: "50mb" }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});
app.use(cors());

//routes
fs.readdirSync("./routes").map((route) =>
  app.use("/api/v1", require(`./routes/${route}`))
);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
