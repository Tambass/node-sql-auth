exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  db.query("SELECT * FROM users WHERE email= ?", [email], (err, result) => {
    if (err || result.length === 0) {
      console.log("result :", result);
      return res.status(401).json({
        error: `Vous n'êtes pas inscrit`,
      });
    } else {
      bcrypt.compare(password, result[0].password, (err, success) => {
        if (err) {
          return res.status(401).json({
            error: `Bcrypt Auth failed`,
          });
        }
        if (success) {
          db.query(
            "SELECT * FROM users WHERE email = ? AND password = ?",
            [email, result[0].password],
            function (err, results) {
              if (results.length) {
                req.session.loggedin = true;
                req.session.firstname = result[0].firstname;
                req.session.userId = result[0].id;
                req.session.role = result[0].role;
                res.redirect("/admin/");
                console.log("req.session :", req.session);
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
  });
};
// Express-session
app.use(
  session({
    secret: "shhuuuuut",
    resave: false,
    saveUninitialized: true,
    name: "biscuit",
    cookie: { maxAge: 24 * 60 * 60 * 7 * 1000 },
  })
);
