
// import everything
module.exports = (db, sequelize, Sequelize) => {
  db.User = require("./user.model.js")(sequelize, Sequelize);
  db.Location = require("./location.model.js")(sequelize, Sequelize);
  db.Character = require("./character.model.js")(sequelize, Sequelize);
  db.Episode = require("./episode.model.js")(sequelize, Sequelize);

  // load associations (fixing sequelize)
  [db.Location, db.Character, db.Episode].forEach((item) => {
    item.associate(db);
  });
}