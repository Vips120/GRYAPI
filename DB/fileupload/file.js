let mongoose = require("mongoose");
let schema = new mongoose.Schema({
    image: { type: String, required: true }
});

let Image = mongoose.model("fileuploads", schema);

module.exports = Image;