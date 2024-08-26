// import * as dotenv from 'dotenv';
// dotenv.config();
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const users = require('./routes/users'); 
const auth = require('./routes/auth');
const refresh = require('./routes/refresh');
const logout = require('./routes/logout');
const credentials = require('./middleware/credentials');
const corsOptions = require('./config/corsOptions');

//express app
const app = express();

// all all origin
// app.use(cors()); 
app.use(credentials)

// Cross Origin Resource Sharing
app.use(cors(corsOptions))

// middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// middleware for cookies
app.use(cookieParser());

// routes
app.use("/api/auth", auth);
app.use("/api/refresh", refresh);
app.use("/api/logout", logout);
app.use("/api/users", verifyJWT, users);

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