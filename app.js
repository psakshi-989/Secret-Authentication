//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

//Level 1: basic checking of whether the entered password for the given username is same as the one that has been registerred or not.
//level 2: using mongoose.encryption so that no one can see the passwordin the database

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://psakshi989:test123@cluster0.ts77p6g.mongodb.net/userDB", { useNewUrlParser: true})
.then(res => console.log('Connected to db'));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
//for adding multiple fields:
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password', 'email', ...] });

const User = new mongoose.model("User", userSchema)

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}).then(function(foundUser){
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
    })
    .catch(function(err){console.log(err);});
})

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save().then(function(err){
        if(err){
            res.render("secrets");
        }
        else{
            console.log(err);
        }
    });
})

app.listen(3000, function(){
    console.log("Server started on port 3000");
});