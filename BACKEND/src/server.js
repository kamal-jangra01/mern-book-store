require("dotenv").config();

const express = require("express");
const databaseConnection = require("./config/connectDB");
const bookRouter = require("./routes/book.routes");
const userRouter = require("./routes/user.routes");
const authMiddleWare = require("./middleware/auth.middleware");
const cors = require("cors");

// database connection
databaseConnection();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/book", authMiddleWare, bookRouter);
app.use("/user", userRouter);

// app.listen(8000, () => {
//   console.log("Port listening on 8000");
// });

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});