const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const adminController = require(

"../controllers/adminController"

);



// Login Page

router.get(

"/login",

adminController.loginPage

);



// Login

router.post(

"/login",

adminController.login

);



// Dashboard

router.get(

"/dashboard",

auth,

adminController.dashboard

);



// Logout

router.get(

"/logout",

adminController.logout

);



module.exports = router;
