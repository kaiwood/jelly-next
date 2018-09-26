const express = require("express");
const router = express.Router();
const passport = require("passport");
const _ = require("lodash");

/**
 * GET /auth/pnut
 */
router.get(
  "/auth/pnut",
  passport.authenticate("pnut", {
    scope: [
      "basic",
      "stream",
      "write_post",
      "follow",
      "update_profile",
      "presence",
      "messages",
      "public_messages",
      "files",
      "polls",
      "email"
    ]
  })
);

/**
 * GET /auth/pnut/callback
 */
router.get(
  "/auth/pnut/callback",
  passport.authenticate("pnut", {
    successRedirect: "/sync-auth",
    failureRedirect: "/"
  })
);

/**
 * GET /login
 */
router.get("/sync-auth", (req, res) => {
  if (req.user && req.user.token) {
    res.write("<script>\n");
    res.write(`sessionStorage.setItem("token", "${req.user.token}");\n`);
    res.write("window.location = '/timeline'\n");
    res.write("</script>\n");
    res.end();
  } else {
    res.redirect("/");
  }
});

module.exports = router;
