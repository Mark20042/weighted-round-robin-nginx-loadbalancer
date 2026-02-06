const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const serverName = process.env.SERVER_NAME || "Unknown Server";

app.get("/", (req, res) => {
  res.send(`Hello World! (served by: ${serverName})`);
});


app.get("/sheeshable", (req, res) => {
  res.send({
    message: "Hello from /sheeshable endpoint!",
    status: "success",
    servedBy: serverName,
  });
});

app.listen(port, () => {
  console.log(`${serverName} listening at http://localhost:${port}`);
});
