
module.exports = (sequelize, Sequelize) => {
  const Episode = sequelize.define("Episode", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    air_date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    episode: {
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

  // relation to Character (characters)
  Episode.associate = function(models) {
    Episode.belongsToMany(models.Character, { through: 'EpisodeCharacter', foreignKey: 'episode_id', as: 'characters' });
  };

  return Episode;
};