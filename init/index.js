const mongoose = require("mongoose");
const initData= require("./data.js");
const Listing =  require("../models/listing.js");

main().then(()=>{console.log("connection Done")}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WonderHotels');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const initDB = async ()=>{
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=> ({...obj , owner : '67911192d5d30ae99c9bdcef'}))
  await Listing.insertMany(initData.data)
  console.log("Data initialized");

};

initDB();