const express = require("express");
const router = express.Router();
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const db = require("./db");
const s3 = require("./s3");
const { s3Url } = require("./config");

const diskStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  filename: function (req, file, callback) {
    uidSafe(24).then(function (uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  },
});

const uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152,
  },
});

router.get("/images", (req, res) => {
  const { lastId } = req.query;
  db.getImages(lastId).then(function (result) {
    res.json({
      images: result.rows,
    });
  });
});

router.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
  const url = `${s3Url}${req.filename}`;

  const { title, description, username } = req.body;

  db.addImage(url, title, description, username)
    .then(({ rows }) => {
      res.status(201).json({
        image: rows[0],
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/images/:id", (req, res) => {
  const { id } = req.params;
  db.getImageById(id)
    .then(function ({ rows }) {
      const comments = rows;
      const image = rows[0];
      db.getNextImageId(id).then(function ({ rows }) {
        const nextImageId = rows[0] ? rows[0].id : null;

        db.getPreviousImageId(id).then(function ({ rows }) {
          const previousImageId = rows[0] ? rows[0].id : null;
          res.json({
            image,
            comments,
            nextImageId,
            previousImageId,
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);

      res.sendStatus(422);
    });
});

router.post("/comments", (req, res) => {
  const { username, comment, image_id } = req.body;

  db.addComment(comment, username, image_id)
    .then(({ rows }) => {
      res.json({
        comment: rows[0],
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/images/:id", (req, res) => {
  const { id } = req.params;

  db.getImageById(id)
    .then(function ({ rows }) {
      const image = rows[0];
      const fileName = image.url.split("/").pop();

      db.deleteImage(id)
        .then(() => {
          s3.delete(fileName)
            .then(() => {
              res.sendStatus(200);
            })
            .catch((err) => {
              console.log(err);
              res.sendStatus(422);
            });
        })
        .catch((err) => {
          console.log(err);
          res.sendStatus(422);
        });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
});

module.exports = router;
