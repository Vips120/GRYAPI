let express = require("express");
let router = express.Router();
let file = require("../../DB/fileupload/file");
let port = "http://localhost:3500";
let multer = require("multer");

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});

let filFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

let upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: filFilter
});

router.post("/file", upload.single("image"), async (req, res) => {
    console.log(req.file);
    let newImg = new file({
        image: port + "/uploads/" + req.file.filename
    });
    let data = await newImg.save();
    res.send(data);
});


router.get("/filebyid/:id", async (req, res) => {
    let image = await file.findById(req.params.id);
    res.send(image);
});



module.exports = router;