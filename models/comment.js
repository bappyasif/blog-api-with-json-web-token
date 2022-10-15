const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    email: {type: Schema.Types.String, required: true},
    name: {type: Schema.Types.String},
    body: {type: Schema.Types.String, required: true},
    posted: {type: Schema.Types.Date},
    blogPost: {type: Schema.Types.ObjectId, ref: "post"}
    // blogPost: {type: Schema.Types.String}
});

module.exports = mongoose.model("comment", CommentSchema);