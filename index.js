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
      { useMongoClient: true }
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
   * Passport, user routes
   */
  const configuredPassport = require("./ingredients/user/user.middleware");

  server.use(configuredPassport.initialize());
  server.use(configuredPassport.session());

  server.use("/", require("./ingredients/user/user.routes.js"));

  /**
   * Application routes
   */
  server.get("/posts/:id", (req, res) => {
    return app.render(req, res, "/posts", { id: req.params.id });
  });

  server.get("/users/:id", (req, res) => {
    return app.render(req, res, "/users", { id: req.params.id });
  });

  server.get("*", (req, res) => {
    const unauthenticatedRoutes = [
      /^\/$/,
      /^\/auth\/pnut$/,
      /^\/auth\/pnut\/callback$/,
      /^\/static\/.*/,
      /^\/_next\/.*/,
      /\/me/
    ];

    let authenticationRequired = true;
    for (let allowedRoute of unauthenticatedRoutes) {
      if (req.path.match(allowedRoute)) {
        authenticationRequired = false;
      }
    }

    if (authenticationRequired && !req.isAuthenticated()) {
      res.redirect("/");
    } else {
      return handle(req, res);
    }
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
