const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {type: Schema.Types.String, required: true},
    body: {type: Schema.Types.String, required: true},
    // author: {type: Schema.Types.ObjectId, ref: "user", required: true},
    author: {type: Schema.Types.ObjectId, ref: "user"},
    authorName: {type: Schema.Types.String},
    posted: {type: Schema.Types.Date, required: true},
    published: {type: Schema.Types.Boolean}
});

module.exports = mongoose.model("post", PostSchema);