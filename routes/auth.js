var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");

/* GET login page. */
router.get("/login", function (req, res, next) {
  res.render("login", { title: "Se connecter" });
});

/* GET register page. */
router.get("/register", function (req, res, next) {
  res.render("register", { title: "S'inscrire" });
});

/* POST register page. */
router.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const emailQuery =
    "SELECT email, password FROM user WHERE email = '" + email + "'";

  try {
    const resultEmail = await query(emailQuery);
    if (resultEmail.length > 0) {
      res.send("Le compte existe déjà");
    } else {
      bcrypt.hash(password, 10, async (err, hash) => {
        await query(
          "INSERT INTO user (email, password, roleId) VALUES ('" +
            email +
            "', '" +
            hash +
            "', 2)"
        );
        res.send("Compte créé");
      });
    }
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
