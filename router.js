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
  db.getInfo().then(function (images) {
    res.json({
      images: images.rows,
    });
  });
});

router.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
  const filename = req.file.filename;
  const url = `${s3Url}${filename}`;

  const { title, description, username } = req.body;

  db.addImage(url, title, description, username)
    .then(({ rows }) => {
      res.json({
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
      var image = rows[0];
      db.getComments(id)
        .then(function ({ rows }) {
          var comments = rows || [];
          res.json({
            image: image,
            comments: comments,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
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

module.exports = router;
