const express = require('express');
const router = express.Router();

const { getPagination, formatPage } = require("./pagination.js");
const db = require("../db/connection");
const Op = db.Sequelize.Op;
const { Episode } = db;

/* GET episodes listing. */
router.get('/', async function(req, res) {
  const { q, page } = req.query;
  const condition = q ? { q: { [Op.like]: `%${q}%` } } : null;
  const { limit, offset } = getPagination(page);

  try {
    const data = await Episode.findAndCountAll({ where: condition, limit, offset });
    res.json(formatPage(data, page));
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Ha ocurrido un error',
    });
  }
});

/* GET single episode . */
router.get('/:id', async function(req, res) {
  const id = req.params.id;

  try {
    const data = await Episode.findByPk(id, { include: 'characters' });
    res.json({ data });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Ha ocurrido un error',
    });
  }
});

module.exports = router;
