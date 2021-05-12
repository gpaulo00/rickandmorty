
// load .env
require('dotenv').config();

const axios = require("axios");
const db = require("./connection");
const Op = db.Sequelize.Op;
const { Episode, Location, Character } = db;

(async () => {
  // recreate models
  await db.sequelize.sync({ force: true });

  // seed data
  let page = 1;
  let count = 1;
  while(page <= count) {
    try {
      const response = await axios.get(`https://rickandmortyapi.com/api/location?page=${page}`);
      count = response.data.info.pages;

      await Location.bulkCreate(response.data.results);
      console.log(`seed: locations saved (page ${page})`);
      page += 1;
    } catch (err) {
      console.error(err);
      console.error("no se pudo cargar las ubicaciones desde la API");
      process.exit(1);
    }
  }

  page = 1;
  count = 1;
  while(page <= count) {
    try {
      const response = await axios.get(`https://rickandmortyapi.com/api/episode?page=${page}`);
      count = response.data.info.pages;

      await Episode.bulkCreate(response.data.results);
      console.log(`seed: episodes saved (page ${page})`);
      page += 1;
    } catch (err) {
      console.error(err);
      console.error("no se pudo cargar los episodios desde la API");
      process.exit(1);
    }
  }

  page = 1;
  count = 1;
  while(page <= count) {
    try {
      const response = await axios.get(`https://rickandmortyapi.com/api/character?page=${page}`);
      count = response.data.info.pages;

      const prom = response.data.results.map((item) => {
        return (async () => {
          const obj = Character.build(item);

          // check origin
          const origin = await Location.findOne({ where: { name: item.origin.name } });
          if (origin) obj.origin_id = origin.id;

          // check location
          const location = await Location.findOne({ where: { name: item.location.name } });
          if (location) obj.location_id = location.id;

          // save
          const res = await obj.save();

          // add episodes
          const episodes = await Episode.findAll({
            where: { url: { [Op.in]: item.episode } },
          });
          await obj.setEpisode(episodes);
        })();
      });

      // await all
      await Promise.all(prom);
      console.log(`seed: characters saved (page ${page})`);
      page += 1;
    } catch (err) {
      console.error(err);
      console.error("no se pudo cargar los caracteres desde la API");
      process.exit(1);
    }
  }
})();