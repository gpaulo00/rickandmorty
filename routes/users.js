const express = require('express');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');

const db = require("../db/connection");
const { User, ApiKey, Sequelize } = db;
const router = express.Router();

/* POST signup */
const registerSh = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required()
})
router.post('/signup', async function(req, res, next) {
  // validate body
  const { error } = registerSh.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  // create user
  try {
    const user = await User.create(req.body);
  } catch (err) {
    if (err instanceof Sequelize.UniqueConstraintError) {
      return res.status(400).json({
        message: 'El email ya ha sido registrado',
      });
    }
    return res.status(400).json({
      message: err.message || 'ha ocurrido un error',
    });
  }

  res.json({
    message: 'Registro exitoso!',
  });
});

/* POST auth */
router.post('/login', async function(req, res, next) {
  // validate body
  const { error } = registerSh.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  // check user
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (user.correctPassword(password)) {
      // crear jwt (guardada en bd)
      const token = jwt.sign({
          name: user.name,
          id: user.id,
      }, process.env.TOKEN_SECRET);
      await ApiKey.create({ token, user_id: user.id });

      // terminar
      return res.json({
        message: 'Inicio de sesion exitoso!',
        token,
      });
    } else {
      // contraseña invalida
      return res.status(400).json({
        message: 'Contraseña no es válida',
      });
    }
  } catch (err) {
    return res.status(404).json({
      message: `No se encontró el usuario "${email}"`,
      error: err.message,
    });
  }
});

module.exports = router;
