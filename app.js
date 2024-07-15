const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const bodyParser = require('body-parser');
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));

const sessionOptions = {
    secret: "mysupersecret",
    resave: false,
    saveInitialized: true,
    cookies: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        // security k andar cross scripting attacks se prevent krne k lie (httpOnly)
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
    res.send("req received !");
})

app.use((req, res,  next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("success");
    next();
})



app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
//ye jo id hai wo bhi idhar app.js me hi reh jati h  isse and review.js me pahch hi nahi pata
//for that we use router = exprress.ROuter({mergeParams: true})
router = express.Router({mergeParams: true});

// my update route
//Update route
// app.put("/listings/:id", wrapAsync( async (req,res) => {
//     let { id } = req.params;
//     let { listing } = req.body;
//     console.log(req.body);
//     console.log(listing);
//     await Listing.findByIdAndUpdate( id, listing, {new:true});
//     res.redirect("/listings");   
// }));

//all the above are checked, now if route doesnt match w 
//any of these routes then this is what err handling should do
app.all("*", (req,res,next) => {
    next(new ExpressError(404, "Page Not Found !"));
});

app.use((err, req, res, next) => {
    let {statusCode =  500, message = "Something went wrong !"} = err;
    res.status(statusCode).render("error.ejs", { message });
})

app.listen(8080, () =>{
    console.log("server listening");
})



main()
    .then(() => {
        console.log("connection successful");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}