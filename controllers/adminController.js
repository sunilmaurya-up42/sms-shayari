const slugify = require("slugify");
console.log("ADMIN CONTROLLER LOADED");
const Shayari = require("../models/Shayari");
const Category = require("../models/Category");
const Comment = require("../models/Comment");
const Settings = require("../models/Settings");


// =====================
// Login Page
// =====================

exports.loginPage = (req, res) => {

    res.render("admin/login");

};

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

console.log("Before Redirect :", req.session);

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

        const totalViews = 0;


        res.render(

            "admin/dashboard",

            {

                totalShayari,

                totalComments,

                pendingComments,

                totalCategories,

                totalViews,

                settings

            }

        );

    }

    catch (err) {

    console.log("DASHBOARD ERROR :", err);

    return res.status(500).send(err.message);

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
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Shayari.countDocuments(query);

        const categories = await Category.find()
            .sort({ name: 1 });
        console.log("BEFORE RENDER");

res.render("admin/shayari", {
    shayari,
    categories,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    search
});

console.log("AFTER RENDER");

    }
    catch (err) {

        console.log("========== SHAYARI PAGE ERROR ==========");
        console.log(err);
        console.log(err.stack);

        return res.status(500).send(err.message);

    }

};

// ===============================
// Add Shayari
// ===============================

exports.addShayari = async (req, res) => {

try{

console.log("BODY :", req.body);

let generatedSlug = slugify(req.body.title || "", {
lower: true,
strict: true
});

if (!generatedSlug) {

generatedSlug = "post-" + Date.now();

}

console.log("SLUG GENERATED :", generatedSlug);

const newShayari = await Shayari.create({

title: req.body.title,

slug: generatedSlug || Date.now().toString(),

slugHindi: req.body.title || "",

content: req.body.content,

category: req.body.category || null,

seoTitle: req.body.seoTitle || "",

seoDescription: req.body.seoDescription || "",

seoKeywords: req.body.seoKeywords || "",

published: req.body.published === "on"

});
    
console.log("SAVED :", newShayari);

return res.redirect("/admin/shayari");

}

catch(err){

console.log("ADD SHAYARI ERROR");

console.log(err);

return res.status(500).send(err.message);

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

    
    exports.deleteShayari = async (req, res) => {

    try {

        console.log("DELETE CONTROLLER HIT");

        await Shayari.findByIdAndDelete(req.params.id);

        console.log("REDIRECTING TO /admin/shayari");

        return res.redirect("/admin/shayari");

    }

    catch (err) {

        console.log(err);

        return res.status(500).send(err.message);

    }

};

// ===================================
// Comments Page
// ===================================

exports.commentsPage = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;

        const search = req.query.search || "";

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

        totalPages: Math.ceil(total / limit),

        search

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

console.log("COMMENTS PAGE ERROR");

console.log(err);

console.log(err.stack);

return res.status(500).send(err.message);

    }

};
// ===================================
// Reply Comment
// ===================================

exports.replyComment = async (req, res) => {

try{

await Comment.findByIdAndUpdate(

req.params.id,

{

adminReply: req.body.reply

}

);

return res.redirect("/admin/comments");

}

catch(err){

console.log("REPLY ERROR");

console.log(err);

return res.redirect("/admin/comments");

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

                categories,
                search: ""

            }

        );

    }

    catch (err) {

    console.log("CATEGORY PAGE ERROR");
    console.log(err);

    return res.status(500).send(err.message);
        

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

try{

let settings = await Settings.findOne();

if(!settings){

settings = await Settings.create({});

}

console.log("SEO PAGE DATA");

console.log(settings);

res.render(

"admin/seo",

{

settings

}

);

}

catch(err){

console.log(err);

res.status(500).send(err.message);

}

};


// ==========================
// Save SEO
// ==========================

exports.saveSeo = async (req, res) => {
    console.log("SEO DATA");
console.log(req.body);
try{

let settings = await Settings.findOne();

if(!settings){

settings = new Settings();

}

settings.siteTitle = req.body.siteTitle;

settings.metaDescription = req.body.metaDescription;

settings.metaKeywords = req.body.metaKeywords;

settings.canonical = req.body.canonical;

settings.robots = req.body.robots;

settings.analytics = req.body.analytics;

settings.verification = req.body.verification;

settings.adsense = req.body.adsense;
    
console.log(req.body);

console.log(settings);

await settings.save();

res.redirect("/admin/seo");

}

catch(err){

console.log(err);

res.status(500).send(err.message);

}

};

// ==========================================
// Settings Page
// ==========================================

exports.settingsPage = async (req, res) => {

try{

let settings = await Settings.findOne();

if(!settings){

settings = await Settings.create({});

}

res.render(

"admin/settings",

{

settings,
request:req

}

);

}

catch(err){

console.log(err);

res.redirect("/admin/dashboard");

}

};


// ==========================================
// Save Settings
// ==========================================

exports.saveSettings = async (req, res) => {

try{

let settings = await Settings.findOne();

if(!settings){

settings = new Settings();

}


settings.siteName = req.body.siteName || "";

settings.siteDescription = req.body.siteDescription || "";

settings.phone = req.body.phone || "";

settings.whatsapp = req.body.whatsapp || "";

settings.email = req.body.email || "";

settings.address = req.body.address || "";

settings.analyticsId = req.body.analyticsId || "";

settings.adsenseCode = req.body.adsenseCode || "";

settings.facebookUrl = req.body.facebookUrl || "";

settings.xUrl = req.body.xUrl || "";

settings.instagramUrl = req.body.instagramUrl || "";

settings.copyrightText = req.body.copyrightText || "";


// Logo Upload

if(req.file){

settings.logo = "/uploads/" + req.file.filename;

}


await settings.save();

res.redirect("/admin/settings?saved=true");

}

catch(err){

console.log(err);

res.redirect("/admin/settings");

}

};
