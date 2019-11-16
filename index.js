let express = require('express');
let app = express();
let mongoose = require("mongoose");
let port = 3500;
let user = require("./API/user/user");
let auth = require("./API/user/auth/user.login");
let config = require("config");
app.use(express.json(1));

if (!config.get("API")) {
    console.log("ACCESS DENIED!");
    process.exit();
};
mongoose.connect("mongodb://localhost/ygr", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("connected to db"))
    .catch(err => console.log('something went wrong', err.message));

app.listen(port, () => console.log(`port working on ${port}`));
app.use("/api/", user);

app.use("/api/", auth);