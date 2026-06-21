const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
router.get("/dashboard", auth, adminController.dashboard);

router.get("/shayari", auth, adminController.shayariPage);

router.get("/shayari/add", auth, adminController.addShayariPage);

router.post("/shayari/add", auth, adminController.addShayari);
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
router.get(

"/shayari/add",

auth,

adminController.addShayariPage

);



router.post(

"/shayari/add",

auth,

adminController.addShayari

);

// Shayari List

router.get(

"/shayari",

auth,

adminController.shayariPage

);

module.exports = router;
