const express = require("express");
const app = express();
const session = require("express-session");
const sessionOpt = {
  secret:"mytypeofsecretcode",
  resave : false,
  saveUninitialized : true,

}
const flash = require("connect-flash")
const path = require("path")

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname,"views"))

port = 3000;


app.listen(3000, ()=>{
  console.log("Server is working at port 3000");
  
})



app.use(session(sessionOpt))
app.use(flash())

app.get("/", (req,res)=>{
  res.send("I am working at 3000");
})

app.get("/count", (req,res)=>{
  if(req.session.count){
    req.session.count++;
  }else{
    req.session.count = 1
  }
  res.send(`counted ${req.session.count} times`);
})

app.get("/register", (req,res)=>{
  let {name= "anonymous"} = req.query
  req.session.name = name;
  req.flash("success", "reg success")
  res.redirect("/hello")
})

app.get("/hello", (req,res)=>{
  res.locals.messages = req.flash("success")
  res.render( "hi.ejs" , {name : req.session.name})
})