let express = require("express");
let router = express.Router();
let M = require("../../DB/user/user");

router.post("/pagination/:page", async (req, res) => {
    let perpage = 10;
    let page = req.params.page || 1;
    let dataCount = await M.UserModel.find()
        .skip((perpage * page) - perpage)
        .limit(perpage);
    let totalData = await M.UserModel.find().count();
    let totalapages = Math.ceil(totalData / perpage);
    res.send({
        perpage: perpage,
        page: page,
        count: totalData,
        totalapages: totalapages,
        dataCount: dataCount
       
    });
});

module.exports = router;