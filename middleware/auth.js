module.exports = (req, res, next) => {

    console.log("AUTH SESSION :", req.session);

    if (req.session && req.session.admin) {

        return next();

    }

    return res.redirect("/admin/login");

};
