
module.exports = (sequelize, Sequelize) => {
  // tabla de relacion M:M (episode - character)
  const EpisodeCharacter = sequelize.define('EpisodeCharacter', {
    episode_id: Sequelize.INTEGER,
    character_id: Sequelize.INTEGER
  }, {});

  EpisodeCharacter.associate = function(models) {
    EpisodeCharacter.belongsTo(models.Episode, { foreignKey: 'episode_id' });
    EpisodeCharacter.belongsTo(models.Character, { foreignKey: 'character_id' });
  };
  return EpisodeCharacter;
};