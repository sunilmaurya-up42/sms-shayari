const express = require("express");
const router = express.Router();

const shayariController = require(
    "../controllers/shayariController"
);


/* =========================
        Home Page
========================= */

router.get(
    "/",
    shayariController.homePage
);



/* =========================
        Single Shayari
========================= */

router.get(
    "/post/:slug",
    shayariController.singlePage
);



/* =========================
        Category
========================= */

router.get(
    "/category/:slug",
    shayariController.categoryPage
);



/* =========================
        Search
========================= */

router.get(
    "/search",
    shayariController.searchPage
);



/* =========================
        Comments
========================= */

router.post(
    "/comment/:id",
    shayariController.addComment
);




/* =========================
        Static Pages
========================= */

router.get(
    "/about-us",
    shayariController.aboutPage
);


router.get(
    "/contact-us",
    shayariController.contactPage
);


router.get(
    "/privacy-policy",
    shayariController.privacyPage
);


router.get(
    "/disclaimer",
    shayariController.disclaimerPage
);


router.get(
    "/terms-and-conditions",
    shayariController.termsPage
);



module.exports = router;
