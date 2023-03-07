const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const homeRouter = require("./routes/home");
const addRouter = require("./routes/add");
const productsRouter = require("./routes/products");
const cardRouter = require("./routes/card");
const authRouter = require("./routes/auth");
const feedbackRouter = require("./routes/feedback")
const orderRouter = require("./routes/order")
const profileRouter = require("./routes/profile")
const session = require("express-session")
const MongoStore = require("connect-mongodb-session")(session)
const User = require('./models/user')
const path = require("path")
const fileUpload = require("express-fileupload")
const app = express();
const varMiddleware = require("./middleware/var")
const userMiddleware = require("./middleware/user")
const flash = require("connect-flash")
require('dotenv').config()
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: require("./utils"),
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

const {MONGODB_URI} = process.env.MONGODB_URI 

const store = new MongoStore({
  collection: "sessions",
  uri: process.env.MONGODB_URI,
})
app.use(flash())
app.use(session({
  secret: "My secret key",
  resave: false,
  saveUninitialized:false,
  store: store
}))
app.use(fileUpload())

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(varMiddleware)
app.use(userMiddleware)

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", homeRouter);
app.use("/add", addRouter);
app.use("/products", productsRouter);
app.use("/card", cardRouter);
app.use("/auth", authRouter);
app.use("/feedback", feedbackRouter)
app.use("/orders", orderRouter)
app.use("/profile", profileRouter)
app.use(express.json());

app.use((req,res)=>{
  res.render("notFound")
}) 


async function starter (){
  try {
      mongoose.set("strictQuery", false);
      
      await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true
    });
    console.log("Mongo is connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running : ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });
  } catch (e){
    console.log(e);
  }
};

starter()


