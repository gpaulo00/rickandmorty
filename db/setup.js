
const db = require("./connection");

(async () => {
  // recreate models
  await db.sequelize.sync({ force: true });
})();