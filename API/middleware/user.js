let jwt = require("jsonwebtoken");
let config = require("config");
function UserMiddleware(req, res, next) {
    try {
        let token = req.header('x-auth-token');
        if (!token) { return res.status(402).send({ message: "ACCESS DEINED" }) }
        let dcoded = jwt.verify(token, config.get("API"));
        req.user = dcoded;
        next();
    }
    catch (ex) {
        res.send("Invalid token");
    }
};

module.exports = UserMiddleware;