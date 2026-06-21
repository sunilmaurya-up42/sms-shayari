const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const adminController = require(
    "../controllers/adminController"
);



/* =========================
        Authentication
========================= */

router.get(
    "/login",
    adminController.loginPage
);

router.post(
    "/login",
    adminController.login
);

router.get(
    "/logout",
    auth,
    adminController.logout
);



/* =========================
        Dashboard
========================= */

router.get(
    "/dashboard",
    auth,
    adminController.dashboard
);



/* =========================
        Shayari
========================= */

router.get(
    "/shayari",
    auth,
    adminController.shayariPage
);


router.post(
    "/shayari/add",
    auth,
    adminController.addShayari
);


router.post(
    "/shayari/update/:id",
    auth,
    adminController.updateShayari
);


router.get(
    "/shayari/delete/:id",
    auth,
    adminController.deleteShayari
);




/* =========================
        Categories
========================= */

router.get(
    "/categories",
    auth,
    adminController.categoriesPage
);


router.post(
    "/categories/add",
    auth,
    adminController.addCategory
);


router.get(
    "/categories/delete/:id",
    auth,
    adminController.deleteCategory
);




/* =========================
        Comments
========================= */

router.get(
    "/comments",
    auth,
    adminController.commentsPage
);


router.get(
    "/comments/approve/:id",
    auth,
    adminController.approveComment
);


router.post(
    "/comments/reply/:id",
    auth,
    adminController.replyComment
);




/* =========================
        SEO
========================= */

router.get(
    "/seo",
    auth,
    adminController.seoPage
);


router.post(
    "/seo",
    auth,
    adminController.saveSeo
);




/* =========================
        Settings
========================= */

router.get(
    "/settings",
    auth,
    adminController.settingsPage
);


router.post(
    "/settings",
    auth,
    adminController.saveSettings
);



module.exports = router;
