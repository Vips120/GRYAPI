let mongoose = require('mongoose');
let Joi = require("@hapi/joi");
let jwt = require("jsonwebtoken");
let config = require("config");
let userSchema = new mongoose.Schema({
    firstname: { type: String, minlength: 4, maxlength: 100, required: true },
    lastname: { type: String, minlength: 4, maxlength: 100, required: true },
    address: { type: String, minlength: 2, maxlength: 250, required: true },
    UserLogin: {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 5, maxlength: 250 }
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: {type: Date}
    
});

userSchema.methods.UserInfo = function () {
    let token = jwt.sign({ _id: this._id }, config.get("API"));
    return token;
} 
let UserModel = mongoose.model("users", userSchema);
function Validationerror(message) {
    let Schema = Joi.object({
        firstname: Joi.string().min(4).max(100).required(),
        lastname: Joi.string().min(4).max(100).required(),
        address: Joi.string().min(2).max(250).required(),
        UserLogin: {
            email: Joi.string().required().email(),
            password: Joi.string().required().min(5).max(250)
        }
    });
    return Schema.validate(message);
};

module.exports = { UserModel, Validationerror };