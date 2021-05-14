const express = require('express');
const Joi = require('@hapi/joi');

const { getPagination, formatPage } = require("./pagination.js");
const db = require("../db/connection");
const Op = db.Sequelize.Op;
const { Location } = db;
const router = express.Router();

/* POST location. */
const createSh = Joi.object({
  name: Joi.string().max(255).required(),
  type: Joi.string().max(1024).required(),
  dimension: Joi.string().max(255).required(),
  url: Joi.string().max(255).required(),
})
router.post('/', async function(req, res) {
  // validate body
  const { error } = createSh.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  // create
  const { name, type, dimension, url } = req.body;
  const loc = { name, type, dimension, url };
  try {
    const data = await Location.create(loc);
    res.json({ data });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Ha ocurrido un error',
    });
  }
});

/* GET locations listing. */
router.get('/', async function(req, res) {
  const { q, page } = req.query;
  const condition = q ? { q: { [Op.like]: `%${q}%` } } : null;
  const { limit, offset } = getPagination(page);

  try {
    const data = await Location.findAndCountAll({ where: condition, limit, offset });
    res.json(formatPage(data, page));
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
    res.json({ data });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Ha ocurrido un error',
    });
  }
});

/* PUT location */
router.put('/:id', async function(req, res) {
  const id = req.params.id;

  // update
  try {
    const data = await Location.update(req.body, { where: { id } });
    res.json({ data });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Ha ocurrido un error',
    });
  }
});

/* DELETE location */
router.delete('/:id', async function(req, res) {
  const id = req.params.id;

  // eliminar
  try {
    const data = await Location.destroy({ where: { id } });
    if (data === 1) return res.json({ message: `Lugar ${id} ha sido eliminado!` });

    return res.json({ message: `Lugar ${id} no existe` });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Ha ocurrido un error',
    });
  }
});

module.exports = router;
