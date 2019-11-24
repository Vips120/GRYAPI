let express = require('express');
let app = express();
let cors = require("cors");
let mongoose = require("mongoose");
let port = 3500;
let user = require("./API/user/user");
let auth = require("./API/user/auth/user.login");
let forgotmailer = require("./API/user/mailer");
let forgotpassword = require("./API/user/forgotpassword");
let page = require("./API/user/pagination");
let file = require("./API/user/fileupload");
let config = require("config");
app.use(express.json(1));
app.use(cors());

if (!config.get("API")) {
    console.log("ACCESS DENIED!");
    process.exit();
};

app.use("/uploads", express.static("uploads"));
mongoose.connect("mongodb://localhost/ygr", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("connected to db"))
    .catch(err => console.log('something went wrong', err.message));

app.listen(port, () => console.log(`port working on ${port}`));
app.use("/api/", user);

app.use("/api/", auth);
app.use("/api/", forgotmailer);
app.use("/api/", forgotpassword);
app.use("/api", page);
app.use("/api/", file);