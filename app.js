import express from "express";
// import mongoose from "mongoose";
import dotenv from "dotenv";
import exphbs from "express-handlebars";
import Todo from "./models/todo.js";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import routes from './routes/index.js'


// console.log("process.env.NODE_ENV", process.env.NODE_ENV);
if (process.env.NODE_ENV !== "production") {
  // console.log('here')
  dotenv.config();
}

const app = express();
const port = process.env.PORT || 3000;

import db from "./config/mongoose.js";

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
// db.once("open", () => {
//   console.log("mongodb connected!");
// });

app.engine("hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(routes)



// app.get("/", (req, res) => {
//   // res.send('hello word')
//   // res.render("index");
//   Todo.find() // 取出 Todo model 裡的所有資料
//     .lean() //把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
//     .sort({_id: 'asc'})
//     .then((todos) => res.render("index", { todos })) // 將資料傳給 index 樣板
//     .catch((error) => console.error(error)); // 錯誤處理
// });

app.get("/todos/new", (req, res) => {
  return res.render("new");
});

// create todo
app.post("/todos", (req, res) => {
  const name = req.body.name; // 從 req.body 拿出表單裡的 name 資料
  return Todo.create({ name }) // 存入資料庫
    .then(() => res.redirect("/")) // 新增完成後導回首頁
    .catch((error) => console.error(error));
});

// search todo item with id
app.get("/todos/:id", (req, res) => {
  const id = req.params.id;
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render("detail", { todo }))
    .catch((error) => console.error(error));
});

// edit todo item with id
app.get("/todos/:id/edit", (req, res) => {
  const id = req.params.id;
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render("edit", { todo }))
    .catch((error) => console.error(error));
});
// update edit value
app.put("/todos/:id", (req, res) => {
  const id = req.params.id;
  const { name, isDone } = req.body;
  return Todo.findById(id)
    .then((todo) => {
      todo.name = name;
      todo.isDone = isDone === "on"; // add finished/unfinished status
      return todo.save();
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch((error) => console.error(error));
});
// app.post("/todos/:id/edit", (req, res) => {
//   const id = req.params.id;
//   const { name , isDone} = req.body;
//   return Todo.findById(id)
//     .then((todo) => {
//       todo.name = name;
//       todo.isDone = isDone === "on"; // add finished/unfinished status
//       return todo.save();
//     })
//     .then(() => res.redirect(`/todos/${id}`))
//     .catch((error) => console.error(error));
// });

// delete a todo item
app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;
  return (
    Todo.findById(id)
      // .then((todo) => todo.remove())
      .then((todo) => todo.deleteOne())
      .then(() => res.redirect("/"))
      .catch((error) => console.log(error))
  );
});
// app.post("/todos/:id/delete", (req, res) => {
//   const id = req.params.id;
//   return (
//     Todo.findById(id)
//       // .then((todo) => todo.remove())
//       .then((todo) => todo.deleteOne())
//       .then(() => res.redirect("/"))
//       .catch((error) => console.log(error))
//   );
// });

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});

export default db;


// https://medium.com/@capable_ming_bear_300/handlebars-upgrade-from-v4-to-v7-0-1-notice-if-you-were-not-using-es6-cf9c878ada9e