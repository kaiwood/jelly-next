const passport = require("passport");
const PnutStrategy = require("passport-pnut").Strategy;
const User = require("./user.model");

passport.use(
  new PnutStrategy(
    {
      clientID: process.env.PNUT_CLIENT_ID,
      clientSecret: process.env.PNUT_CLIENT_SECRET,
      callbackURL: `${process.env.APP_URL}/auth/pnut/callback`
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOrCreate({ username: profile.username }, function(err, user) {
        if (err) done(err, user);

        user.token = accessToken;
        user.save(err => {
          done(err, user);
        });
      });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  User.findOne({ username: username }, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;
