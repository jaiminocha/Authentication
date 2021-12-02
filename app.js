require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// const encrypt = require("mongoose-encryption");
const md5 = require('md5');

const app = express();

// console.log(process.env.SECRET);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true })

// New User Database 
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

// console.log(md5("12345"));

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save((err) => {
        if (!err) {
            res.render("secrets");
        } else {

            console.log("Error!");
        }
    });
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log("Error");
        } else {
            if (foundUser) {
                // console.log(password);
                if (foundUser.password == password) {

                    res.render("secrets");
                }
            }
        }
    })
})

app.listen(3000, function() {
    console.log("Server started on port 3000");
});