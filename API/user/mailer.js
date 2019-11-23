let express = require("express");
let router = express.Router();
let crypto = require("crypto");
let M = require("../../DB/user/user");
let nodemailer = require("nodemailer");
router.post("/forgotmail", async (req, res) => {
    let token = crypto.randomBytes(32).toString("hex");
    let user = await M.UserModel.findOne({ "UserLogin.email": req.body.UserLogin.email });
    if(!user) {return res.status(403).send({message:"Invalid Email Id"})}
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hrs
    let data = await user.save();


    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'wynebatman@gmail.com', // generated ethereal user
            pass: 'vipulsingh' // generated ethereal password
        }
    });

    if (!transporter) res.status(401).send({
        message: 'something went wrong'
    });
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Vs Apps:sweat_smile:" <wynebatman@gmail.com>', // sender address
        to: user.UserLogin.email, // list of receivers
        subject: 'Reset Your Password', // Subject line:smile:
        text: 'open this link to change your password http://localhost:4200/forgotpassword/' + token // plain text body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
    res.send({ message: "PLEASE CHECKOUT YOUR GMAIL", d: data });
})


module.exports = router;