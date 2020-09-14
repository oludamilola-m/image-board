const spicedPg = require("spiced-pg");
require("dotenv").config();
const db = spicedPg(process.env.DB_URL);

module.exports.getInfo = () => {
  return db.query(`SELECT * FROM images`);
};
