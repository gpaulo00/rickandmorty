
// import everything
module.exports = (db, sequelize, Sequelize) => {
  db.users = require("./user.model.js")(sequelize, Sequelize);
  db.location = require("./location.model.js")(sequelize, Sequelize);
  db.character = require("./character.model.js")(sequelize, Sequelize);
  db.episode = require("./episode.model.js")(sequelize, Sequelize);

  // relation models
  require("./episode_character.model.js")(sequelize, Sequelize);
}