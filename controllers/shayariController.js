const Shayari = require("../models/Shayari");
const Category = require("../models/Category");
const Settings = require("../models/Settings");
const Comment = require("../models/Comment");


// ===================================
// Home Page
// ===================================

exports.homePage = async (req, res) => {

try{

const page = parseInt(req.query.page) || 1;
const limit = 10;
const skip = (page - 1) * limit;

const search = req.query.search || "";

let filter = {
published:true
};

if(search){

filter.title = {
$regex:search,
$options:"i"
};

}


const shayariList = await Shayari.find(filter)

.populate("category")

.sort({createdAt:-1})

.skip(skip)

.limit(limit);



for(const item of shayariList){

item.commentsCount = await Comment.countDocuments({

postId:item._id,

approved:true

});
    item.comments = await Comment.find({

postId: item._id,

approved: true

})
.sort({ createdAt:-1 });

}


const total = await Shayari.countDocuments(filter);

const totalPages = Math.ceil(total/limit);

const categories = await Category.find()

.sort({name:1});


let settings = await Settings.findOne();

if(!settings){

settings = await Settings.create({});

}


res.render("home",{

shayariList,

categories,

settings,

currentPage:page,

totalPages,

search,

totalShayari:total,

activeCategory:null,
    
request:req

});

}

catch(err){

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

try{

console.log("COMMENT HIT");

console.log(req.body);

await Comment.create({

postId: req.params.id,

name: req.body.name,

comment: req.body.comment,

approved: true

});

console.log("COMMENT SAVED");

return res.redirect(req.get("Referer") || "/");

}

catch(err){

console.log("COMMENT ERROR");

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

// ===================================
// Like Shayari
// ===================================

exports.likePost = async (req,res)=>{

try{

const post = await Shayari.findById(req.params.id);

if(!post){

return res.status(404).json({

success:false

});

}

post.likes = (post.likes || 0) + 1;

await post.save();

return res.json({

success:true,

likes:post.likes

});

}

catch(err){

console.log(err);

return res.status(500).json({

success:false

});

}

};
