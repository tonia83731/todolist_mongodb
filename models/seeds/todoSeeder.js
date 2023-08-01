// import mongoose from "mongoose";
import Todo from "../todo.js";
import dotenv from "dotenv";

// console.log("process.env.NODE_ENV", process.env.NODE_ENV);
if (process.env.NODE_ENV !== "production") {
  // console.log("here");
  dotenv.config();
}

import db from "../../config/mongoose.js";

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// 取得資料庫連線狀態
// const db = mongoose.connection;
// 連線異常
// db.on("error", () => {
//   console.log("mongodb error!");
// });
// 連線成功
db.once("open", () => {
  console.log("mongodb connected!");
  for (let i = 0; i < 10; i++) {
    Todo.create({ name: `name-${i}` });
  }
  console.log("done");
});

