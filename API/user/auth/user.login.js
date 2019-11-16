let express = require("express");
let router = express.Router();
let db = require("../../../DB/user/user");
let Joi = require("@hapi/joi");
let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");
let config = require("config");

router.post("/auth", async (req, res) => {
    let user = await db.UserModel.findOne({ "UserLogin.email": req.body.UserLogin.email });
    if(!user) {return res.status(403).send({message:"Invalid email id"})}
    let { error } = Loginvalidationerror(req.body);
    if (error) { return res.send(error.details[0].message) }
    let password = await bcrypt.compare(req.body.UserLogin.password, user.UserLogin.password);
    if (!password) { return res.status(403).send({ message: "Invalid password" }) }
    // let token = jwt.sign({ _id: user._id,firstname:user.firstname }, config.get("API"));
    let token = user.UserInfo();
    res.header('x-auth-token', token).send({ message: "Login Successful" , token:token});
});

//IEP -> INFORMATION EXPERT PRINCIPLE
function Loginvalidationerror(error) {
    let schema = Joi.object({
        UserLogin: {
            email: Joi.string().required().email(),
            password: Joi.string().required().min(5).max(250)
        }
    });
    return schema.validate(error);
};

module.exports = router;