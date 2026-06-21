const express = require("express");

const router = express.Router();

const shayariController = require(
    "../controllers/shayariController"
);



// =========================
// Home
// =========================

router.get(

    "/",

    shayariController.homePage

);




// =========================
// Single Shayari
// =========================

router.get(

    "/post/:slug",

    shayariController.singlePage

);




// =========================
// Category
// =========================

router.get(

    "/category/:slug",

    shayariController.categoryPage

);




// =========================
// Comment
// =========================

router.post(

    "/comment/:id",

    shayariController.addComment

);




// =========================
// Static Pages
// =========================

router.get(

    "/about",

    shayariController.aboutPage

);


router.get(

    "/contact",

    shayariController.contactPage

);


router.get(

    "/privacy-policy",

    shayariController.privacyPolicyPage

);


router.get(

    "/disclaimer",

    shayariController.disclaimerPage

);




module.exports = router;
