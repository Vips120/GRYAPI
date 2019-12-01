let express = require('express');
let bcrypt = require("bcryptjs");
let router = express.Router();
let User = require('../../DB/user/user');
let jwt = require("jsonwebtoken");
let config = require("config");
let userMid = require("../middleware/user");
//SESSION-COOKIES
router.get("/user", async (req, res) => {
    let usersession = req.session.username;
    if (!usersession) {
        usersession = "YOGESH PAWAR";
        res.send(usersession)
    } else {
        res.send(usersession);
    }
});

//loggedIn user
router.get("/me", userMid, async (req, res) => {
    let user = await User.UserModel.findById(req.user._id).select(["-UserLogin.password"]);
    res.send(user);
});


//UserRegistration
router.get("/alluser", async (req, res) => {
    let data = await User.UserModel.find();
    res.send(data);
});
router.post("/newUser", async (req, res) => {
    let user = await User.UserModel.findOne({ "UserLogin.email": req.body.UserLogin.email });
    if (user) { return res.status(403).send({ message: 'email already in our system' }) }
    let { error } = User.Validationerror(req.body);
    if (error) { return res.send(error.details[0].message) }
    let newUser = new User.UserModel({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        address: req.body.address,
        UserLogin: req.body.UserLogin
    });
    let salt = await bcrypt.genSalt(10);
    newUser.UserLogin.password = await bcrypt.hash(newUser.UserLogin.password, salt);
    let data = await newUser.save();
    // let token = jwt.sign({ _id: data._id }, config.get("API"));
    let token = data.UserInfo();
    res.send({ message: 'Congrats! Registration got successful', d: data, token: token });
});

module.exports = router;