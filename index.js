const express = require("express");
const app = express();
const router = require("./routers");

app.use(express.static("public"));

app.use(router);
app.listen(8080, () => console.log("Listening to serve Vue!"));
