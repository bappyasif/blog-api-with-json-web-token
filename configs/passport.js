const fs = require("fs");
const path = require("path");
const User = require("../models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const pathToPubKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToPubKey, "utf-8");

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ["RS256"]
}

// verify callback
const strategy = new JwtStrategy(options, (payload, done) => {
    User.find({_id: payload.sub})
        .then(user => {
            if(user) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        }).catch(err => done(err))
})

module.exports = (passport) => passport.use(strategy)