
module.exports = (sequelize, Sequelize) => {
  const Episode = sequelize.define("episode", {
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
    paranoid: true,
    createdAt: 'created',
  });

  // relation to Character (characters)
  Episode.associate = function(models) {
    Episode.belongsToMany(models.Character, { through: 'episode_characters', foreignKey: 'episode_id', as: 'characters' });
  };

  return Episode;
};