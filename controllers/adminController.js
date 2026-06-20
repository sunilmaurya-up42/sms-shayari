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


// Dashboard
exports.dashboard = (req, res) => {

    res.render("admin/dashboard");

};


// Logout
exports.logout = (req, res) => {

    req.session.destroy();


    res.redirect("/admin/login");

};
