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

//show the most recent first (dont push but unshift it)

module.exports = router;
