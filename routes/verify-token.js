
const jwt = require('jsonwebtoken');
const db = require("../db/connection");
const { ApiKey } = db;

// middleware to validate token (rutas protegidas)
const verifyToken = async (req, res, next) => {
  const token = req.header('X-ApiKey');
  if (!token) return res.status(403).json({ message: 'Acceso denegado' });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const apiKey = await ApiKey.findOne({ where: { token, user_id: verified.id } });
    if (!apiKey) throw "No es valido";

    // set user & next
    req.user = verified;
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Api key no es válido' });
  }
}

module.exports = verifyToken;