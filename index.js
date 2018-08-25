require("dotenv").config();

const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  /**
   * Database, Express middleware
   */
  const mongoose = require("mongoose");
  const MongoStore = require("connect-mongo")(session);
  mongoose.Promise = global.Promise;
  mongoose
    .connect(
      process.env.MONGODB_CONNECTION_URL,
      { useNewUrlParser: true }
    )
    .then(() => console.log("Mongoose connected successfully…"))
    .catch(err => console.log(err));

  server.use(cookieParser(process.env.COOKIE_SECRET));

  server.set("trust proxy", 1);
  server.use(
    session({
      name: process.env.SESSION_NAME,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
      cookie: {
        secure: !dev,
        httpOnly: true,
        maxAge: null
      }
    })
  );

  /**
   * Passport
   */
  const passport = require("passport");
  const PnutStrategy = require("passport-pnut").Strategy;
  const User = require("./ingredients/user/user.model");

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

  server.use(passport.initialize());
  server.use(passport.session());
  server.use("/", require("./ingredients/user/user.routes.js"));

  /**
   * Application routes
   */
  server.get("/posts/:id", (req, res) => {
    return app.render(req, res, "/posts", { id: req.params.id });
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
