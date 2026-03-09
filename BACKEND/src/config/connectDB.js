const mongoose = require("mongoose");

const databaseConnection = async () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database connected successfully !");
    })
    .catch((err) => {
      console.log("Database connection failed ", err);
    });
};

module.exports = databaseConnection;

// mongodb+srv://kamaldeep63951_db_user:TbvLsRK2ZM4YdsaM@cluster0.xsz2my5.mongodb.net/?appName=Cluster0
