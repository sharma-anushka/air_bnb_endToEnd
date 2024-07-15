const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require("../utils/expressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require('../models/review');
const Listing = require('../models/listing');


const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    
    if(error) {
        throw new ExpressError(400, error);
    }else{
        next();
    }
};

//Reviews
router.post("/",validateReview, wrapAsync(async (req,res) => {
    let listing = await Listing.findById(req.params.id);
    console.log(listing);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created !");
    res.redirect(`/listings/${listing._id}`);
}));

//Delete review Route
router.delete("/:reviewId" , wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    //listing ke  array me bhi delete
    await Listing.findByIdAndUpdate( id, {$pull: {reviews: reviewId}});

    await Review.findById(reviewId);
    req.flash("success", "Review Deleted !");
    res.redirect(`/listings/${id}`)
}));

module.exports = router;