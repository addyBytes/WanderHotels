const Listing = require("../models/listing.js")


module.exports.index = async (req,res)=>{
  const allListing = await Listing.find({});
  res.render("./listings/index.ejs" , {allListing});
}

module.exports.renderNewForm =  (req,res)=>{
  
  res.render("./listings/new.ejs");
 }

 module.exports.showRoute = async (req,res)=>{
  let {id} = req.params;
 const ListingHotel = await Listing.findById(id).populate({path :"reviews", populate:{path:"author"}}).populate("owner");
  if(!ListingHotel){
   req.flash("error", "Listing does not exists")
   res.redirect("/listings");
  }
  res.render("./listings/show.ejs" , {ListingHotel});
 }

 module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url,"...",filename)
   const newListing = new Listing(req.body.Listing);
   newListing.owner = req.user._id;
   newListing.image = {url,filename}
   await newListing.save();
   req.flash("success", "New Listing created")
   res.redirect("/listings");
  
 }

 module.exports.editListing = async (req,res)=>{
  let {id} = req.params;
  const ListingHotel = await Listing.findById(id);
  req.flash("success", "Listing Edited")
  if(!ListingHotel){
   req.flash("error", "Listing does not exists")
   res.redirect("/listings");
  }
  let og = ListingHotel.image.url;
  og = og.replace("/upload", "/upload/h_250,w_100")
  res.render("./listings/edit.ejs" , {ListingHotel,og});
 }

 module.exports.updateListing = async (req,res)=>{

  let {id} = req.params;
 
  let listing = await Listing.findByIdAndUpdate(id, {...req.body.Listing});
  if(typeof req.file !=="undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url,filename}
  await listing.save()
}
  req.flash("success","Listing Updated")
  res.redirect(`/listings/${id}`);
 }

 module.exports.deleteListing = async (req,res)=>{
  let {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
 console.log(deletedListing);
 req.flash("success", "Listing Deleted")
 res.redirect("/listings");
 }