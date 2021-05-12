
module.exports = (sequelize, Sequelize) => {
  const Location = sequelize.define("Location", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    dimension: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
    createdAt: 'created',
  });

  // relation to Character (residents)
  Location.associate = function(models) {
    Location.hasMany(models.Character, { foreignKey: 'location_id', as: 'residents' });
  };

  return Location;
};