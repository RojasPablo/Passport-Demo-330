// install libraries
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys')
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id) // Store the user ID in the session
})

// on requests, () used to retrieve user object
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user) // retrieve user details from the database and attach to req.user
    })
})

// Strategies in Passport.js determine how users are authenticated, EX: Google OAuth
passport.use(
    new GoogleStrategy({
        // initialize google strategy
        callbackURL:'/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
        // call back function 
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our DB
        User.findOne({ googleId: profile.id }).then((currentUser) => {
            if(currentUser) {
                // already have the user
                console.log('User is: ', currentUser)
                // if user authentication = success, done() is called
                // done: null 1st argument = no err, authenticated user as 2nd argument
                done(null, currentUser)
            } else {
                // create new user using User Model
                new User({
                    username: profile.displayName,
                    googleId: profile.id,
                    thumbnail: profile._json.picture
                }).save().then((newUser) => {
                    console.log('New User Created:', newUser)
                    done(null, newUser);
                })
            }
        })
    })
)

