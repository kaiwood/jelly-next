const express = require("express");
const router = express.Router();
const passport = require("passport");
const _ = require("lodash");

/**
 * GET /me
 */
router.get("/me", (req, res) => {
  const token = _.get(req, "user.token");

  if (token) {
    res.json({ token });
  } else {
    res.status(401).json({ status: "Unauthorized" });
  }
});

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
    successRedirect: "/timeline",
    failureRedirect: "/"
  })
);

module.exports = router;
