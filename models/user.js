const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true, 
    }
});

//plugged this in cuz passportLocalMongoose createsthings on its own
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);