const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
 

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync( async(req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("success", "Welcome to WanderLust");
        res.redirect("/listings");
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
})

// router.post("/login", (req, res, next) => {
//     passport.authenticate("local", (err, user, info) => {
//         if (err) {
//             return next(err);
//         }
//         if (!user) {
//             return res.redirect("/login");
//         }
//         req.logIn(user, (err) => {
//             if (err) {
//                 return next(err);
//             }
//             return res.send("Welcome to Wandelust! You are logged in.");
//         });
//     })(req, res, next);
// });


// router.post("/login", passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true
// }), (req, res) => {
//     req.flash("success", "Welcome back!");
//     res.redirect("/listings");
// });

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    res.redirect('/');
});


module.exports = router;