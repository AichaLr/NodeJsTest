const express = require("express");
const userController = require("./controllers/userController");

const userRouter = require("./routes/userRoutes");

const app = express();
app.use(express.json());

// 3) ROUTES
app.use("/api/v1/users", userRouter);
module.exports = app;
