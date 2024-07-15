const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title : {
        type :String,
        required : true,
    },
    description : {
        type : String,
        required : true},
    image: {
        filename: String,
        url: {
            type: String,
            set: (v) => v === "" ? "https://unsplash.com/photos/a-view-of-the-golden-gate-bridge-at-sunset-2qjwaPLOQ5c" : v
        }
    },
    price : Number,
    location : String,
    country : String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],    
});

//deleting reviews automatically if listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
    await Review.deleteMany({_id : {$in: listing.reviews }});
}})

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;