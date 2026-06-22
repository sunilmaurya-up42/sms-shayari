module.exports = (req, res, next) => {

    console.log(req.session);

    if (
        req.session &&
        req.session.admin
    ) {
        return next();
    }

    return res.redirect("/admin/login");

};
