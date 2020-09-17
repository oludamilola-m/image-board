const spicedPg = require("spiced-pg");
require("dotenv").config();
const db = spicedPg(process.env.DB_URL);

module.exports.addImage = (url, title, description, username) => {
  return db.query(
    `INSERT INTO images (url, title, description, username ) 
    VALUES ($1,$2,$3, $4)
        RETURNING * `,
    [url, title, description, username]
  );
};
module.exports.addComment = (comment, username, image_id) => {
  return db.query(
    `INSERT INTO comments (comment, username, image_id) 
    VALUES ($1,$2,$3)
        RETURNING * `,
    [comment, username, image_id]
  );
};

module.exports.getImages = (lastId = null) => {
  if (lastId) {
    return db.query(
      `SELECT * FROM images WHERE id < $1 ORDER BY id DESC LIMIT 9`,
      [lastId]
    );
  }
  return db.query(`SELECT * FROM images ORDER BY id DESC LIMIT 9`);
};

module.exports.getImageById = (id) => {
  return db.query(`SELECT * FROM images WHERE id = $1`, [id]);
};

module.exports.getComments = (image_id) => {
  return db.query(
    `SELECT * FROM comments WHERE image_id = ($1) ORDER BY id DESC`,
    [image_id]
  );
};
