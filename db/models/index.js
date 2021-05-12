
// import everything
module.exports = (db, sequelize, Sequelize) => {
  // rick & morty
  db.Location = require("./location.model.js")(sequelize, Sequelize);
  db.Character = require("./character.model.js")(sequelize, Sequelize);
  db.Episode = require("./episode.model.js")(sequelize, Sequelize);

  // auth
  db.User = require("./user.model.js")(sequelize, Sequelize);
  db.ApiKey = require("./apikey.model.js")(sequelize, Sequelize);

  // load associations (fixing sequelize)
  [db.Location, db.Character, db.Episode, db.User, db.ApiKey].forEach((item) => {
    item.associate(db);
  });
}