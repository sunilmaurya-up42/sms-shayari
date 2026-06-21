module.exports = (req, res, next) => {

    if (!req.session.admin) {

        req.session.message = "Please login first";

        return res.redirect("/admin/login");

    }

    next();

};
