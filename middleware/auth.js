module.exports = (req, res, next) => {

    if (
        req.session &&
        req.session.admin === true
    ) {
        return next();
    }

    return res.redirect("/admin/login");

};
