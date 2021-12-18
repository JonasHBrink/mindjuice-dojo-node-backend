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
var {Base64Encode} = require('base64-stream')

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
    response.setHeader('Content-Type', 'text/html')
    const stream = fs.createReadStream(`${__dirname}/zindex.html`)
    // No need to call res.end() because pipe calls it automatically
    stream.pipe(response)
  } 
  /**
   * `/fileUpload` only works with POST
   * Saves uploaded files to the root
   */
  else if (req.url == '/fileUpload' && req.method.toLowerCase() == 'post') {
    let contentLength = parseInt(req.headers['content-length'])
    if (isNaN(contentLength) || contentLength <= 0 ) {
      response.statusCode = 411;
      response.setHeader(headers);
      response.end(JSON.stringify({status: 'error', description: 'No File'}))
      return
    }

    // Try to use the original filename
    let filename = req.headers['filename']
    if (filename == null) {
      filename = "file." + req.headers['content-type'].split('/')[1]
    }


    const client = new ftp.Client(/*timeout = 180000*/) // 2min timeout for debug
    client.ftp.verbose = true
    client.access({
      host: "linux110.unoeuro.com",
      user: "studiebyen-humle.dk",
      password: "Crockstar612",
      secure: false
    }).then(ftpResponse => {
      (async () => {
        try {
          // Upload the image to the FTP server
          await client.uploadFrom(req, `uploads/${filename}`)

          // Download the image from the FTP server and send it as response
          response.setHeader('Content-Type', req.headers['content-type'])
          var base64Encoder = new Base64Encode()
          base64Encoder.pipe(response)
          await client.downloadTo(base64Encoder, `uploads/${filename}`)
        }
        catch(err) {
          console.log(err)
          response.statusCode = 400;
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify({status: 'error', description: error}))
        }
        client.close()
      })();
    })
  } 
  /**
   * Error on any other path
   */
  else {
    response.setHeader('Content-Type', 'text/html')
    response.end('<html><body><h1>Page Doesn\'t exist<h1></body></html>')
  }
}).listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
})