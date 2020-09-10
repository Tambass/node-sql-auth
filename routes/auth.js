const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const session = require("express-session");

// Middleware
const verifyAuth = require("../middleware/auth.middleware");

// Express-session
router.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    name: "cookie",
    cookie: { maxAge: 24 * 60 * 60 * 7 * 1000 },
  })
);

/* GET login page. */
router.get("/login", function (req, res, next) {
  res.render("login", { title: "Se connecter" });
});

/* POST login */
router.post("/login", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  await query(
    "SELECT id, email, password, roleId FROM user WHERE email = ?",
    [email],
    (err, result) => {
      if (err || result.length === 0) {
        console.log("result :", result);
        return res.status(401).json({
          error: `Vous n'êtes pas inscrit`,
        });
      } else {
        bcrypt.compare(password, result[0].password, async (err, success) => {
          if (err) {
            return res.status(401).json({
              error: `Bcrypt Auth failed`,
            });
          }
          if (success) {
            await query(
              "SELECT id, email, password, roleId FROM user WHERE email = ? AND password = ?",
              [email, result[0].password],
              function (err, results) {
                console.log("");
                if (results.length) {
                  req.session.loggedin = true;
                  req.session.cookie.expires = false;
                  req.session.cookie.maxAge = 5 * 60 * 1000;
                  req.session.userId = result[0].id;
                  req.session.email = result[0].email;
                  req.session.password = result[0].password;
                  req.session.roleId = result[0].roleId;
                  console.log("req.session :", req.session);
                  res.redirect("/users/list");
                } else {
                  res.send(err);
                }
              }
            );
          } else {
            res.send("Email ou mot de passe incorrect !");
          }
        });
      }
    }
  );
});

/* GET register page. */
router.get("/register", verifyAuth, function (req, res, next) {
  res.render("register", { title: "S'inscrire" });
});

/* POST register page. */
router.post("/register", async (req, res, next) => {
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
        res.redirect("/users/list");
      });
    }
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
