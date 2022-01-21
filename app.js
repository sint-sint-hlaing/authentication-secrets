//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// console.log(md5('user'));

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]})

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
})

app.get("/register", function (req, res) {
    res.render("register");
})

app.get("/login", function (req, res) {
    res.render("login");
})

app.post("/register", function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const user = new User({
            email: req.body.username,
            password: hash
        })
        user.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        })
    })
})

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({
        email: username
    }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function (err, result) {
                    if (result === true) {
                        res.render("secrets")
                    }
                })
            }
        }
    })
})

app.listen(3000, function (req, res) {
    console.log("Server is running on port 3000!");
})