// import * as dotenv from 'dotenv';
// dotenv.config();
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const users = require('./routes/users'); 

//express app
const app = express();

// middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/users", users);
// app.use("/api/login", login);


// connection
const connectionString = `${process.env.MONGO_URI}${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster-1`;

// connect to db
mongoose
  .connect(connectionString)
  // .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log(
        "connected to db & listening for requests on port",
        process.env.PORT
      );
    });
  })
  .catch((error) => {
    console.log("There is an error:", error);
});