const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const methodOverride = require("method-override");
const mysql = require("mysql");
const util = require("util");
const session = require("express-session");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const app = express();

// Express-session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    name: "cookie",
    cookie: { maxAge: 24 * 60 * 60 * 7 * 1000 },
  })
);

require("dotenv").config();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Method OverRide
app.use(methodOverride("_method"));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);

// Mysql
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATA,
  // multipleStatements: true,
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connecté à la base MySQL");
});
const query = util.promisify(db.query).bind(db);
global.db = db;
global.query = query;

// catch 404 and forward to error handler
//app.use(function (req, res, next) {
//  next(createError(404));
//});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
