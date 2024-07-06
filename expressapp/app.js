const express = require("express");
const app = express();
 
app.use(function (_, response) {
  response.sendFile(__dirname + "/index.html");
});
 
app.listen(3000);