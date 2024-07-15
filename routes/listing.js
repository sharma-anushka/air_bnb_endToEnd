const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require("../utils/expressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    
    if(error) {
        throw new ExpressError(400, error);
    }else{
        next();
    }
}
 
//index route
router.get("/" , wrapAsync(async (req,res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings});
}));

//CREATE NEW ROUTE
router.get("/new", (req,res) =>{
    res.render("listings/new")
})

//show route
router.get("/:id", wrapAsync(async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
}));

//edit route
router.get("/:id/edit", wrapAsync(async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/edit.ejs", {listing});
   
}));

//POST NEW LISTING ROUTE
router.post("/",validateListing, wrapAsync (async (req, res, next) => {
    
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send Valid Data for Listing");
    // }
    const newListing = new Listing(req.body.listing) ;  
    await newListing.save();
    req.flash("success", "New Listing Created !");
    res.redirect("/listings");
}));

//helper func
function convertToNestedObject(obj) {
    const result = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const keys = key.split('.');
            keys.reduce((acc, part, index) => {
                if (index === keys.length - 1) {
                    acc[part] = obj[key];
                } else {
                    acc[part] = acc[part] || {};
                }
                return acc[part];
            }, result);
        }
    }
    return result;
}

// chatGpt update route
router.put("/:id", validateListing, wrapAsync (async (req, res) => {
    let { id } = req.params;
    let { listing } = req.body;

    // Ensure listing is properly initialized
    if (!listing) {
        req.flash("error", "Listing data is missing");
        return res.redirect(`/listings/${id}/edit`);
    }

    // Log the original request body
    console.log("Original req.body:", req.body);

    // Convert dot-notated keys to nested objects
    listing = convertToNestedObject(listing);

    // Log the converted listing object
    console.log("Converted listing object:", listing);
    
    const updatedListing = await Listing.findByIdAndUpdate(id, listing, { new: true });
    console.log("Updated Listing:", updatedListing);
    req.flash("success", "Listing Updated !");
    res.redirect("/listings");   
}));


//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted !");
    res.redirect("/listings");
}));


module.exports = router;