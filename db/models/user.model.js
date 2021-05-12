
const crypto = require('crypto');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      get() {
        return () => this.getDataValue('password');
      },
    },
    salt: {
      type: Sequelize.STRING,
      get() {
        return () => this.getDataValue('salt');
      },
    }
  });

  // password cipher
  User.generateSalt = function() {
    return crypto.randomBytes(16).toString('base64');
  }
  User.encryptPassword = function(plainText, salt) {
    return crypto
      .createHash('RSA-SHA256')
      .update(plainText)
      .update(salt)
      .digest('hex');
  }

  // model hooks
  const setSaltAndPassword = user => {
    if (user.changed('password')) {
      user.salt = User.generateSalt();
      user.password = User.encryptPassword(user.password(), user.salt());
    }
  }
  User.beforeCreate(setSaltAndPassword);
  User.beforeUpdate(setSaltAndPassword);

  // password checking
  User.prototype.correctPassword = function(enteredPassword) {
    return User.encryptPassword(enteredPassword, this.salt()) === this.password();
  }

  return User;
};