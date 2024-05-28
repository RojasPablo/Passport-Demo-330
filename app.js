const express = require('express');
const mustacheExpress = require('mustache-express');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const passportSetup = require('./config/passport-setup')
const mongoose = require('mongoose');
const keys = require('./config/keys');
const session = require('express-session');
const passport = require('passport');

const app = express();

// set view engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');

// session middleware // manages user sessions, allowing the app to keep track of user data across requests
app.use(session({
    secret: keys.session.cookieKey,          // A key used to sign and verify session cookies
    resave: false,                           // Only save session if it has been modified
    saveUninitialized: false,                // Only create and save a session if there is  data to store 
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // Cookie lasts for one full day
}));

// initialize passport 
app.use(passport.initialize());
app.use(passport.session());

// connect to mongoDB
mongoose.connect(keys.mongodb.dbURI)
    .then(() => {
        console.log('connected to MongoDB');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
});

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// create home route
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

app.listen(3010, () => {
    console.log('app now listening for requests on port 3010');
});