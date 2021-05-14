
module.exports = (sequelize, Sequelize) => {
  const Character = sequelize.define("character", {
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
    origin_id: {
      type: Sequelize.INTEGER,
      get() {
        return () => this.getDataValue('origin_id');
      },
    },
    location_id: {
      type: Sequelize.INTEGER,
      get() {
        return () => this.getDataValue('location_id');
      },
    },
  }, {
    timestamps: true,
    paranoid: true,
    createdAt: 'created',
  });

  Character.associate = function(models) {
    // relation to Episode (episode)
    Character.belongsToMany(models.Episode, { through: 'episode_characters', foreignKey: 'character_id', as: 'episode' });

    // relation to Location (origin, location)
    Character.belongsTo(models.Location, { foreignKey: 'origin_id', as: 'origin' });
    Character.belongsTo(models.Location, { foreignKey: 'location_id', as: 'location' });
  };

  return Character;
};