const Shayari = require("../models/Shayari");
const Category = require("../models/Category");
const Settings = require("../models/Settings");
const Comment = require("../models/Comment");


// ===================================
// Home Page
// ===================================
exports.homePage = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        for (let item of shayariList) {

item.commentsCount = await Comment.countDocuments({

postId: item._id,

approved: true

});

        }

        const search = req.query.search || "";

        let filter = {
            published: true
        };

        if (search) {
            filter.title = {
                $regex: search,
                $options: "i"
            };
        }

        const shayariList = await Shayari.find(filter)
            .populate("category")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Shayari.countDocuments(filter);

        const totalPages = Math.ceil(total / limit);

        const categories = await Category.find()
            .sort({ name: 1 });

        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({});
        }

        res.render("home", {
    shayariList,
    categories,
    settings,
    currentPage: page,
    totalPages,
    search,
    totalShayari: total,
    activeCategory: null
});

    } catch (err) {

        console.log(err);

        res.send("Server Error");

    }

};


// ===================================
// Single Shayari Page
// ===================================
exports.singlePage = async (req, res) => {

    try {

        const post = await Shayari.findOne({
            slug: req.params.slug,
            published: true
        }).populate("category");


        if (!post) {
            return res.redirect("/");
        }


        post.views += 1;
        await post.save();


        const comments = await Comment.find({
            postId: post._id,
            approved: true
        }).sort({
            createdAt: -1
        });


        const relatedPosts = await Shayari.find({
            category: post.category?._id,
            _id: {
                $ne: post._id
            },
            published: true
        }).limit(5);


        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({});
        }


        res.render("single", {
            post,
            comments,
            relatedPosts,
            settings
        });

    }

    catch (err) {

        console.log(err);

        res.redirect("/");

    }

};


// ===================================
// Category Page
// ===================================
exports.categoryPage = async (req, res) => {

    try {

        const category = await Category.findOne({
            slug: req.params.slug
        });


        if (!category) {
            return res.redirect("/");
        }


        const shayariList = await Shayari.find({
            category: category._id,
            published: true
        })
        .populate("category")
        .sort({
            createdAt: -1
        });


        const categories = await Category.find();


        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({});
        }


        res.render("category", {
            category,
            shayariList,
            categories,
            settings
        });

    }

    catch (err) {

        console.log(err);

        res.redirect("/");

    }

};


// ===================================
// Add Comment
// ===================================
exports.addComment = async (req, res) => {

    try {

        await Comment.create({

            postId: req.params.id,

            name: "Anonymous",

            comment: req.body.comment,

            approved: false

        });

        return res.redirect(req.get("Referer") || "/");

    }

    catch (err) {

        console.log(err);

        return res.redirect(req.get("Referer") || "/");

    }

};


// ===================================
// About Page
// ===================================
exports.aboutPage = (req, res) => {

    res.render("about");

};


// ===================================
// Contact Page
// ===================================
exports.contactPage = (req, res) => {

    res.render("contact");

};


// ===================================
// Privacy Policy Page
// ===================================
exports.privacyPolicyPage = (req, res) => {

    res.render("privacy-policy");

};


// ===================================
// Disclaimer Page
// ===================================
exports.disclaimerPage = (req, res) => {

    res.render("disclaimer");

};
