
module.exports = (sequelize, Sequelize) => {
  const ApiKey = sequelize.define("api_key", {
    token: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    user_id: Sequelize.INTEGER,
  });

  // relation to User (creator user)
  ApiKey.associate = function(models) {
    ApiKey.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return ApiKey;
};