const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).render("unauthorized");
  }

  jwt.verify(token, "THISISSECRET", (err, user) => {
    if (err) {
      return res.status(403).render("unauthorized");
    }
    req.userId = user.userId;
    next();
  });
}

module.exports = authenticateToken;
