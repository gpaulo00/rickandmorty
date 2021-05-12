const express = require('express');
const router = express.Router();

const db = require("../db/connection");
const Op = db.Sequelize.Op;
const { Location } = db;

/* GET locations listing. */
router.get('/', async function(req, res) {
  const q = req.query.q;
  const condition = q ? { q: { [Op.like]: `%${q}%` } } : null;

  try {
    const data = await Location.findAll({ where: condition });
    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Ha ocurrido un error',
    });
  }
});

/* GET single location . */
router.get('/:id', async function(req, res) {
  const id = req.params.id;

  try {
    const data = await Location.findByPk(id, { include: 'residents' });
    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Ha ocurrido un error',
    });
  }
});

module.exports = router;
