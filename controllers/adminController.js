
const slugify = require("slugify");

const Shayari = require("../models/Shayari");
const Category = require("../models/Category");
const Comment = require("../models/Comment");
const Settings = require("../models/Settings");

// =====================
// Login
// =====================

        exports.login = async (req, res) => {

try {

const { email, password } = req.body;

console.log("Email :", email);
console.log("Admin Email :", process.env.ADMIN_EMAIL);

if (

email === process.env.ADMIN_EMAIL &&

password === process.env.ADMIN_PASSWORD

) {

req.session.admin = true;

console.log("Session :", req.session);

return res.redirect("/admin/dashboard");

}

return res.render(

"admin/login",

{

error: "Invalid Email or Password"

}

);

}

catch(err){

console.log("LOGIN ERROR :", err);

return res.status(500).send(err.message);

}

};

// =====================
// Dashboard
// =====================

exports.dashboard = async (req, res) => {

    try {

        const totalShayari =

            await Shayari.countDocuments();



        const totalComments =

            await Comment.countDocuments();



        const pendingComments =

            await Comment.countDocuments({

                approved: false

            });



        const totalCategories =

            await Category.countDocuments();



        const settings =

            await Settings.findOne();



        res.render(

            "admin/dashboard",

            {

                totalShayari,

                totalComments,

                pendingComments,

                totalCategories,

                settings

            }

        );

    }

    catch (err) {

        console.log(err);

    }

};




// =====================
// Logout
// =====================

exports.logout = (req, res) => {

    req.session.destroy(() => {

        res.redirect("/admin/login");

    });

};

// ===============================
// Shayari List Page
// ===============================

exports.shayariPage = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;

        const limit = 10;

        const skip = (page - 1) * limit;


        const search = req.query.search || "";


        let query = {};


        if (search) {

            query.title = {

                $regex: search,

                $options: "i"

            };

        }


        const shayari = await Shayari.find(query)

            .populate("category")

            .sort({

                createdAt: -1

            })

            .skip(skip)

            .limit(limit);



        const total = await Shayari.countDocuments(

            query

        );


        const categories =

            await Category.find()

            .sort({

                name: 1

            });



        res.render(

            "admin/shayari",

            {

                shayari,

                categories,

                currentPage: page,

                totalPages: Math.ceil(

                    total / limit

                ),

                search

            }

        );

    }

    catch (err) {

        console.log(err);

    }

};



// ===============================
// Add Shayari
// ===============================

exports.addShayari = async (req, res) => {

    try {

        await Shayari.create({


            title:

                req.body.title,


            slug:

                slugify(

                    req.body.title,

                    {

                        lower: true,

                        strict: true

                    }

                ),


            content:

                req.body.content,


            category:

                req.body.category,


            seoTitle:

                req.body.seoTitle || "",


            seoDescription:

                req.body.seoDescription || "",


            seoKeywords:

                req.body.seoKeywords || "",


            published:

                req.body.published === "on"


        });



        res.redirect(

            "/admin/shayari"

        );

    }

    catch (err) {

        console.log(err);

    }

};



// ===============================
// Update Shayari
// ===============================

exports.updateShayari = async (

    req,

    res

) => {

    try {


        await Shayari.findByIdAndUpdate(

            req.params.id,

            {


                title:

                    req.body.title,


                slug:

                    slugify(

                        req.body.title,

                        {

                            lower: true,

                            strict: true

                        }

                    ),


                content:

                    req.body.content,


                category:

                    req.body.category,


                seoTitle:

                    req.body.seoTitle,


                seoDescription:

                    req.body.seoDescription,


                seoKeywords:

                    req.body.seoKeywords,


                published:

                    req.body.published === "on"


            }

        );



        res.redirect(

            "/admin/shayari"

        );

    }

    catch (err) {

        console.log(err);

    }

};



// ===============================
// Delete Shayari
// ===============================

exports.deleteShayari = async (

    req,

    res

) => {

    try {


        await Shayari.findByIdAndDelete(

            req.params.id

        );


        res.redirect(

            "/admin/shayari"

        );

    }

    catch (err) {

        console.log(err);

    }

};
// ===================================
// Comments Page
// ===================================

exports.commentsPage = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;

        const limit = 10;

        const skip = (page - 1) * limit;


        const comments = await Comment.find()

            .populate({

                path: "postId",

                select: "title slug"

            })

            .sort({

                createdAt: -1

            })

            .skip(skip)

            .limit(limit);



        const total = await Comment.countDocuments();



        res.render(

            "admin/comments",

            {

                comments,

                currentPage: page,

                totalPages: Math.ceil(

                    total / limit

                )

            }

        );

    }

    catch (err) {

        console.log(err);

    }

};




// ===================================
// Approve Comment
// ===================================

exports.approveComment = async (

    req,

    res

) => {

    try {

        await Comment.findByIdAndUpdate(

            req.params.id,

            {

                approved: true

            }

        );


        res.redirect(

            "/admin/comments"

        );

    }

    catch (err) {

        console.log(err);

    }

};




// ===================================
// Reply Comment
// ===================================

exports.replyComment = async (

    req,

    res

) => {

    try {

        await Comment.findByIdAndUpdate(

            req.params.id,

            {

                adminReply:

                    req.body.adminReply

            }

        );


        res.redirect(

            "/admin/comments"

        );

    }

    catch (err) {

        console.log(err);

    }

};




// ===================================
// Delete Comment
// ===================================

exports.deleteComment = async (

    req,

    res

) => {

    try {

        await Comment.findByIdAndDelete(

            req.params.id

        );


        res.redirect(

            "/admin/comments"

        );

    }

    catch (err) {

        console.log(err);

    }

};
// ===================================
// Categories Page
// ===================================

exports.categoriesPage = async (req, res) => {

    try {

        const categories = await Category.find()

            .sort({

                createdAt: -1

            });


        res.render(

            "admin/categories",

            {

                categories

            }

        );

    }

    catch (err) {

        console.log(err);

    }

};




// ===================================
// Add Category
// ===================================

exports.addCategory = async (

    req,

    res

) => {

    try {

        await Category.create({

            name:

                req.body.name,


            slug:

                slugify(

                    req.body.name,

                    {

                        lower: true,

                        strict: true

                    }

                ),


            description:

                req.body.description || ""

        });



        res.redirect(

            "/admin/categories"

        );

    }

    catch (err) {

        console.log(err);

    }

};




// ===================================
// Update Category
// ===================================

exports.updateCategory = async (

    req,

    res

) => {

    try {

        await Category.findByIdAndUpdate(

            req.params.id,

            {

                name:

                    req.body.name,


                slug:

                    slugify(

                        req.body.name,

                        {

                            lower: true,

                            strict: true

                        }

                    ),


                description:

                    req.body.description || ""

            }

        );


        res.redirect(

            "/admin/categories"

        );

    }

    catch (err) {

        console.log(err);

    }

};




// ===================================
// Delete Category
// ===================================

exports.deleteCategory = async (

    req,

    res

) => {

    try {

        await Category.findByIdAndDelete(

            req.params.id

        );


        res.redirect(

            "/admin/categories"

        );

    }

    catch (err) {

        console.log(err);

    }

};
// ==========================
// SEO Page
// ==========================

exports.seoPage = async (req, res) => {

    try {

        let settings = await Settings.findOne();


        if (!settings) {

            settings = await Settings.create({});

        }


        res.render(

            "admin/seo",

            {

                settings

            }

        );

    }

    catch (err) {

        console.log(err);

    }

};




// ==========================
// Save SEO
// ==========================

exports.saveSeo = async (req, res) => {

    try {

        let settings = await Settings.findOne();


        if (!settings) {

            settings = new Settings();

        }



        settings.metaTitle =

            req.body.metaTitle;



        settings.metaDescription =

            req.body.metaDescription;



        settings.metaKeywords =

            req.body.metaKeywords;



        await settings.save();



        res.redirect(

            "/admin/seo"

        );

    }

    catch (err) {

        console.log(err);

    }

};

// ==========================================
// Settings Page
// ==========================================

exports.settingsPage = async (req, res) => {

    try {

        let settings = await Settings.findOne();


        if (!settings) {

            settings = await Settings.create({});

        }


        res.render(

            "admin/settings",

            {

                settings

            }

        );

    }

    catch (err) {

        console.log(err);

        res.redirect(

            "/admin/dashboard"

        );

    }

};




// ==========================================
// Save Settings
// ==========================================

exports.saveSettings = async (req, res) => {

    try {

        let settings = await Settings.findOne();


        if (!settings) {

            settings = new Settings();

        }



        settings.siteName =

            req.body.siteName || "";


        settings.siteDescription =

            req.body.siteDescription || "";


        settings.logo =

            req.body.logo || "";


        settings.phone =

            req.body.phone || "";


        settings.whatsapp =

            req.body.whatsapp || "";


        settings.email =

            req.body.email || "";


        settings.address =

            req.body.address || "";


        settings.analyticsId =

            req.body.analyticsId || "";


        settings.adsenseCode =

            req.body.adsenseCode || "";


        settings.facebookUrl =

            req.body.facebookUrl || "";


        settings.xUrl =

            req.body.xUrl || "";


        settings.instagramUrl =

            req.body.instagramUrl || "";


        settings.copyrightText =

            req.body.copyrightText || "";



        await settings.save();



        res.redirect(

            "/admin/settings"

        );

    }

    catch (err) {

        console.log(err);

        res.redirect(

            "/admin/settings"

        );

    }

};
