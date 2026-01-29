const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey123', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
};

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey123', async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

const requireAdmin = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey123', (err, decodedToken) => {
            if (err) {
                res.redirect('/login');
            } else {
                if (decodedToken.role === 'admin') {
                    next();
                } else {
                    res.status(403).send('Access Denied: You do not have permission to view this resource.');
                }
            }
        });
    } else {
        res.redirect('/login');
    }
}

module.exports = { requireAuth, checkUser, requireAdmin };
