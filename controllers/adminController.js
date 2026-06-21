const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");


// Login Page
exports.loginPage = (req, res) => {

    res.render("admin/login");

};


// Login
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;


        const admin = await Admin.findOne({ email });


        if (!admin) {

            return res.send("Admin not found");

        }


        const match = await bcrypt.compare(

            password,

            admin.password

        );


        if (!match) {

            return res.send("Wrong password");

        }


        req.session.admin = admin._id;


        res.redirect("/admin/dashboard");

    }

    catch (err) {

        console.log(err);

    }

};

// Login Functions ke niche add karo

exports.shayariPage = async (req, res) => {

    const shayari = await Shayari.find()
        .populate("category");

    res.render("admin/shayari", {
        shayari
    });

};

// Dashboard
exports.dashboard = (req, res) => {

    res.render("admin/dashboard");

};


// Logout
exports.logout = (req, res) => {

    req.session.destroy();


    res.redirect("/admin/login");

};

const Shayari=require("../models/Shayari");

const Category=require("../models/Category");



exports.addShayariPage=async(req,res)=>{


const categories=await Category.find();



res.render(

"admin/add-shayari",

{

categories

}

);


};




exports.addShayari=async(req,res)=>{


await Shayari.create({



title:req.body.title,


content:req.body.content,


category:req.body.category,


seoTitle:req.body.seoTitle,


seoDescription:req.body.seoDescription,


published:req.body.published



});



res.redirect("/admin/shayari");


};

exports.deleteShayari = async (req, res) => {

    await Shayari.findByIdAndDelete(

        req.params.id

    );

    res.redirect("/admin/shayari");

};
