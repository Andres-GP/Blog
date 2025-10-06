require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const connectDB = require("./server/config/db");
const { isActiveRoute } = require("./server/helpers/routeHelpers");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.use(express.static("public"));

app.use(expressLayout);
app.set("layout", "./main");
app.set("view engine", "ejs");

app.locals.isActiveRoute = isActiveRoute;

// Routes
app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/user"));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
