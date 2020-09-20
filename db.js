const spicedPg = require("spiced-pg");
require("dotenv").config();
const db = spicedPg(process.env.DATABASE_URL);

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
        RETURNING  username AS comment_username, comment, created_at AS comment_created_at`,
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

module.exports.getComments = (image_id) => {
  return db.query(
    `SELECT * FROM comments WHERE image_id = ($1) ORDER BY id DESC`,
    [image_id]
  );
};

module.exports.getImageById = (id) => {
  return db.query(
    `SELECT images.*, comments.created_at AS comment_created_at, comments.username AS comment_username, comment FROM images LEFT JOIN comments ON images.id = comments.image_id WHERE images.id = $1`,
    [id]
  );
};

module.exports.getNextImageId = (id) => {
  return db.query(`SELECT id FROM images WHERE id > $1 LIMIT 1`, [id]);
};

module.exports.getPreviousImageId = (id) => {
  return db.query(
    `SELECT id FROM images WHERE id < $1  ORDER BY id DESC LIMIT 1`,
    [id]
  );
};

module.exports.deleteImage = (id) => {
  return db.query(`DELETE FROM images WHERE id= $1`, [id]);
};
