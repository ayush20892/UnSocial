const express = require("express");
require("dotenv").config();
var cors = require("cors");

const app = express();

const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000", "https://unsocial.netlify.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Routes
const homeRoute = require("./server/routes/homeRoute");
const userRoute = require("./server/routes/userRoute");
const postRoute = require("./server/routes/postRoute");
const notificationRoute = require("./server/routes/notificationRoute");

app.use("/api/v1", homeRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", postRoute);
app.use("/api/v1", notificationRoute);

module.exports = app;
