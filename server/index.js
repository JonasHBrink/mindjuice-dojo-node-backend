// const express = require("express");
// const PORT = process.env.PORT || 3001;
// const app = express();
// const cors = require('cors');
// const ftp = require("basic-ftp");

// app.use(
//   cors({
//     origin: '*'
//   })
// );

// app.use(
//   express.urlencoded({
//     extended: true
//   })
// )

// app.use(express.json())

// app.get("/api", (req, res) => {
//   res.json({ message: "Hello from server!" });
// });

// app.post("/upload", (req, res) => {
//   upload(req.body.todo);
//   res.json({ message: req.body.todo });
// });

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

// app.listen(PORT, () => {
//   console.log(`Server listening on ${PORT}`);
// });
const http = require('http');
const fs = require('fs')

// Third-party modules
const ftp = require("basic-ftp")
var { Base64Encode } = require('base64-stream')

let port = 3001

http.createServer((req, response) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
    /** add other headers as per requirement */
  };
  /**
   * `/` loads index.html
   */
  if (req.url == '/' && req.method.toLowerCase() == 'get') {
    response.writeHead = (200, headers);
  }
  /**
   * `/fileUpload` only works with POST
   * Saves uploaded files to the root
   */
  else if (req.url == '/fileUpload' && req.method.toLowerCase() == 'post') {
    response.writeHead = (200, headers);
    // let contentLength = parseInt(req.headers['content-length'])
    // if (isNaN(contentLength) || contentLength <= 0) {
    //   response.writeHead = (411, headers);
    //   response.end(JSON.stringify({ status: 'error', description: 'No File' }))
    //   return
    // }

    // // Try to use the original filename
    // let filename = req.headers['filename']
    // if (filename == null) {
    //   filename = "file." + req.headers['content-type'].split('/')[1]
    // }


    // const client = new ftp.Client(/*timeout = 180000*/) // 2min timeout for debug
    // client.ftp.verbose = true
    // client.access({
    //   host: "linux110.unoeuro.com",
    //   user: "studiebyen-humle.dk",
    //   password: "Crockstar612",
    //   secure: false
    // }).then(ftpResponse => {
    //   (async () => {
    //     try {
    //       // Upload the image to the FTP server
    //       await client.uploadFrom(req, `uploads/${filename}`)
    //       // Download the image from the FTP server and send it as response
    //       response.writeHead = (201, headers);
    //       var base64Encoder = new Base64Encode()
    //       base64Encoder.pipe(response)
    //       await client.downloadTo(base64Encoder, `uploads/${filename}`)
    //     }
    //     catch (err) {
    //       console.log(err)
    //       response.writeHead = (400, headers);
    //       response.end(JSON.stringify({ status: 'error', description: error }))
    //     }
    //     client.close()
    //   })();
    // })
  }
  /**
   * Error on any other path
   */
  else {
    response.writeHead = (411, headers);
    response.end('<html><body><h1>Page Doesn\'t exist<h1></body></html>')
  }
}).listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
})