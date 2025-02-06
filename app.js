if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressErrors = require("./utils/ExpressErrors.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const listings = require("./routes/listings.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")
const multer  = require('multer');
const { config } = require('dotenv');
const upload = multer({ dest: 'uploads/' })
const dbUrl = process.env.ATLASDB_URL
const MongoStore = require('connect-mongo');

// const port = process.env.PORT || 8080;
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname,"views"))
app.use(express.urlencoded({extended : true}))
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})
store.on("error",()=>{
  console.log("error in store")
})
const sessionOpt = {
  store,
  secret:process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie :{
    expires : Date.now()+ 7*24*60*60*1000,
    maxAge : 7*24*60*60*1000,
    httpOnly : true,
  },
};



main().then(()=>{console.log("connection Done")}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// app.listen(port, ()=>{
//   console.log(`Server running on port ${port}`);
  
// })




app.use(session(sessionOpt))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user ;
  next();
})

app.use("/listings" , listings);
app.use("/listings/:id/reviews" , reviews);
app.use("/" , userRouter);


// app.get("/", (req,res)=>{
//   res.send("I am working");
// })


// app.get("/demouser", async (req,res)=>{
//   let fakeUser = new User ({
//     email : "student@gmail.com",
//     username : "stud123"
//   });
//   let reg = await User.register(fakeUser, "helloword");
//   console.log(reg);
//   res.send(reg);
// })

app.all("*", (req,res,next)=>{
  next(new ExpressErrors(404, "Page not found"))
})

app.use((err,req,res,next)=>{
  let{statusCode=500,message="Something went wrong"} = err;
  // res.status(statusCode).send(message)
  res.render("error.ejs", {err})
})