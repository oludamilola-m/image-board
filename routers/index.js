const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/images", (req, res) => {
  db.getInfo().then(function (images) {
    res.json({
      setImage: images.rows,
    });
  });
});

module.exports = router;
