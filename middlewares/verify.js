const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (!authHeader) return res.status(401).json("unauthenticated");
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json("token is not valid");
    req.user = user;
    next();
  });
};

const verifyAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id !== req.params.id || !req.user.isAdmin)
      return res.status(403).json("not allowed");
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user.isAdmin)
      return res.status(403).json("not allowed");
    next();
  });
};

module.exports = { verifyToken, verifyAuthorization, verifyAdmin };
