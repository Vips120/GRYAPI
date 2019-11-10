let express = require('express');
let bcrypt = require("bcryptjs");
let router = express.Router();
let User = require('../../DB/user/user');

//UserRegistration

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
    res.send({ message: 'Congrats! Registration got successful', d: data });
});

module.exports = router;