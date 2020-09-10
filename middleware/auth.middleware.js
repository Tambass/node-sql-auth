module.exports = async (req, res, next) => {
  const role = req.session.userId;

  try {
    console.log("role :", role);
    const query = await query("SELECT id FROM user WHERE id = '" + role + "'");
    if (query.length) {
      next();
    } else {
      res.redirect("/auth/login");
    }
  } catch (err) {
    res.send(err);
  }
  //if(query.length > 0){}
};
