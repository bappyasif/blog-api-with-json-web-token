const express = require("express");
const cors = require("cors");
const passport = require("passport");
const router = require("./routes");
const app = express();

// connecting databse
require("./configs/database");

// Pass the global passport object into the configuration function
require("./configs/passport")(passport);

// This will initialize the passport object on every request
app.use(passport.initialize())

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server is running on port: ${PORT}`))