const express = require("express");
const router = express.Router();
const passport = require("passport");

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
    successRedirect: "/settings",
    failureRedirect: "/"
  })
);

module.exports = router;
