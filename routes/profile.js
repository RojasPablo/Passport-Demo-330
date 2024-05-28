const router = require('express').Router();

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/auth/login');
    }
};

router.get('/', ensureAuthenticated, (req, res) => {
    res.render('profile', { user: req.user });
});

module.exports = router;