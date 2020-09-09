var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");

/* GET users listing. */
router.get("/list", async (req, res) => {
  const user = await query(
    "SELECT u.id, u.email, u.password, r.name AS role FROM user AS u JOIN roles AS r ON u.roleId = r.id"
  );

  res.render("list", { title: "Liste des utilisateur", user });
});

router.get("/editUser/:id", async (req, res) => {
  const id = req.params.id;
  const user = await query(
    "SELECT u.id, u.email, u.password, r.name AS role FROM user AS u JOIN roles AS r ON u.roleId = r.id WHERE u.id = '" +
      id +
      "'"
  );
  console.log("user:", user[0]);
  res.render("editUser", { title: "Modifier le profile", user: user[0] });
});

router.put("/editUser/:id", async (req, res) => {
  console.log("req ok");
  const id = req.params.id;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;

  try {
    bcrypt.hash(password, 10, async (err, hash) => {
      await query(
        "UPDATE user AS u SET email = '" +
          email +
          "', password = '" +
          hash +
          "' WHERE u.id = '" +
          id +
          "'"
      );
      res.redirect("/users/list");
      //console.log();
      //  res.redirect("users/list");
    });
  } catch (err) {
    res.send(err);
  }
});

router.delete("/deleteUser/:id", async (req, res) => {
  const id = req.params.id;

  await query("DELETE FROM user WHERE id = '" + id + "'");

  res.redirect("/users/list");
});

module.exports = router;
