const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require('cors');
const ftp = require("basic-ftp");

app.use(
  cors({
    origin: '*'
  })
);

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post("/upload", (req, res) => {
  upload(req.body.todo);
  res.json({ message: req.body.todo });
});

async function upload(file) {
  const client = new ftp.Client()
  client.ftp.verbose = true
  try {
    await client.access({
      host: "linux110.unoeuro.com",
      user: "studiebyen-humle.dk",
      password: "Crockstar612",
      secure: true
    })
    console.log(await client.list())
    await client.uploadFrom(file, "jonas")
    // await client.downloadTo("README_COPY.md", "README_FTP.md")
  }
  catch (err) {
    console.log(err)
  }
  client.close()
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});