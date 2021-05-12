var express = require('express');
var router = express.Router();

const db = require("../db/connection");
const Op = db.Sequelize.Op;
const Episodes = db.episode;

/* GET episodes listing. */
router.get('/', async function(req, res, next) {
  const q = req.query.q;
  var condition = q ? { q: { [Op.like]: `%${q}%` } } : null;

  try {
    const data = await Episodes.findAll({ where: condition });
    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Ha ocurrido un error',
    });
  }
});

module.exports = router;
