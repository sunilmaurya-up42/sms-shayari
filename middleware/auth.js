module.exports = (req, res, next) => {

    console.log("SESSION :", req.session);

    if (
        req.session &&
        req.session.admin === true
    ) {
        return next();
    }

    return res.redirect("/admin/login");

};
