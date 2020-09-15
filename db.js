const spicedPg = require("spiced-pg");
require("dotenv").config();
const db = spicedPg(process.env.DB_URL);

module.exports.getInfo = () => {
  return db.query(`SELECT * FROM images ORDER BY id DESC`);
};

module.exports.addImage = (url, title, description, username) => {
  return db.query(
    `INSERT INTO images (url, title, description, username ) 
    VALUES ($1,$2,$3, $4)
        RETURNING * `,
    [url, title, description, username]
  );
};
