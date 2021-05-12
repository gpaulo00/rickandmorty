const express = require('express');
const router = express.Router();

const db = require("../db/connection");
const Op = db.Sequelize.Op;
const { Character } = db;

/* GET characters listing. */
router.get('/', async function(req, res) {
  const q = req.query.q;
  const condition = q ? { q: { [Op.like]: `%${q}%` } } : null;

  try {
    const data = await Character.findAll({ where: condition });
    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Ha ocurrido un error',
    });
  }
});

/* GET single character . */
router.get('/:id', async function(req, res) {
  const id = req.params.id;

  try {
    const data = await Character.findByPk(id, { include: ['episode', 'origin', 'location'] });
    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Ha ocurrido un error',
    });
  }
});

module.exports = router;
