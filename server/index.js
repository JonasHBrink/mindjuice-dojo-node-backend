const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();
const cors = require('cors');

app.use(cors({
  origin: '*'
}));

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post("/upload", (req, res) => {
  res.json({ message: "Hello from server!", reg: req });
});

// const ftp = require("basic-ftp")

// async function upload(file) {
//   const client = new ftp.Client()
//   client.ftp.verbose = true
//   try {
//     await client.access({
//       host: "linux110.unoeuro.com",
//       user: "studiebyen-humle.dk",
//       password: "Crockstar612",
//       secure: true
//     })
//     console.log(await client.list())
//     await client.uploadFrom(file, "jonas")
//     // await client.downloadTo("README_COPY.md", "README_FTP.md")
//   }
//   catch (err) {
//     console.log(err)
//   }
//   client.close()
// }

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});