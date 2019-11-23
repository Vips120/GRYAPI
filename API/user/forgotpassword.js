let express = require("express");
let router = express.Router();
let bcrypt = require("bcryptjs");
let D = require("../../DB/user/user");
let Joi = require("@hapi/joi");


router.post("/forgotpassword/:token", async (req, res) => {
    let user = await D.UserModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) { return res.status(403).send({ message: "Invalid token" }) }
    let { error } = ValidationError(req.body);
    if (error) { return res.send(error.details[0].message) }
    let compare = await bcrypt.compare(req.body.UserLogin.password, user.UserLogin.password);
    console.log(compare);
    if (compare) { return res.status(403).send({ message: "old password please make a new password" }) }
    let salt = await bcrypt.genSalt(10);
    user.UserLogin.password = await bcrypt.hash(req.body.UserLogin.password, salt);
    user.resetPasswordExpires = undefined;
    user.resetPasswordToken = undefined;
    await user.save();
    res.send({ message: "Updated the password " });
});

function ValidationError(message) {
    let Schema = Joi.object({
        UserLogin: {
            password: Joi.string().required().min(5).max(250)
        }
    });
    return Schema.validate(message);
}
module.exports = router;