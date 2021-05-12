
module.exports = (sequelize, Sequelize) => {
  const Character = sequelize.define("Character", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    species: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    origin_id: Sequelize.INTEGER,
    location_id: Sequelize.INTEGER,
  }, {
    timestamps: true,
    createdAt: 'created',
  });

  Character.associate = function(models) {
    // relation to Episode (episode)
    Character.belongsToMany(models.Episode, { through: 'EpisodeCharacter', foreignKey: 'character_id', as: 'episode' });

    // relation to Location (origin, location)
    Character.belongsTo(models.Location, { foreignKey: 'origin_id', as: 'origin' });
    Character.belongsTo(models.Location, { foreignKey: 'location_id', as: 'location' });
  };

  return Character;
};