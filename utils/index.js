const crypto = require("crypto");
const jsonwebtoken =  require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const pathToPrivKey = path.join(__dirname, "..", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToPrivKey, "utf-8");

// This function uses the crypto library to decrypt the hash using the salt and then compares
// the decrypted hash/salt with the password that the user provided at login
function validPassword(password, hash, salt) {
    let hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
    return hashVerify === hash;
}

// This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
// password in the database, the salt and hash are stored for security
function genPassword(password) {
    let salt = crypto.randomBytes(32).toString("hex");
    let genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
    
    return {
        salt,
        hash: genHash
    }
}

// We need this(user) to set the JWT `sub` payload property to the MongoDB user ID
function issueJWT(user) {
    // console.log(user, "user")
    const _id = user?._id;

    // const expiresIn = "1d";
    const expiresIn = "1";

    const payload = {
        sub: _id,
        iat: Date.now()
    }

    let options = {
        expiresIn: expiresIn,
        algorithm: "RS256"
    }

    const signedtoken = jsonwebtoken.sign(payload, PRIV_KEY, options)
    // const signedtoken = jsonwebtoken.sign(payload, process.env.PRIV_KEY, options)

    // console.log(process.env.PRIV_KEY, "private")

    return {
        token: "Bearer "+ signedtoken,
        expires: expiresIn
    }
}


module.exports = {
    validPassword,
    genPassword,
    issueJWT
}