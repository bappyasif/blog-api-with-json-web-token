const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: Schema.Types.String,
    email: Schema.Types.String,
    password: Schema.Types.String,
    salt: Schema.Types.String,
    hash: Schema.Types.String
});

module.exports = mongoose.model("user", UserSchema)