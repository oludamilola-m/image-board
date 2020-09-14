const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("public"));

app.get("/animals", (req, res) => {
  db.getInfo().then(function (images) {
    let setImage = images.rows;
    res.json({
      setImage,
    });
  });

  // we sent back data as json not as res.render
});

app.listen(8080, () => console.log("Listening to serve Vue!"));
