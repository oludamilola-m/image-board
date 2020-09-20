const express = require("express");
const app = express();

const router = require("./router.js");

app.use(express.json());
app.use(express.static("public"));
app.use(express.static("sql"));

app.use(router);

app.listen(prcoess.env.PORT || 8080, () =>
  console.log("Listening to serve Vue!")
);
