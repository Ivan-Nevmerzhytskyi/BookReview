import express from 'express';
import path from 'path';
import fs from 'fs';
import zlib from 'zlib';
// import { pipeline } from 'stream';

export const downloadRouter = express.Router();

// for downloading a fileName in client side
downloadRouter.get('/:fileName', async(req, res) => {
  const { fileName } = req.params;
  const filePath = path.resolve('download', fileName);

  if (!fs.existsSync(filePath)) {
    res.status(404).send('File does not exist');
    // res.statusCode = 404;
    // res.end('File does not exist');

    return;
  }

  if (fs.statSync(filePath).isDirectory()) {
    res.status(422).send('You are trying to read a folder');

    return;
  }

  // Content-Disposition: attachment - for downloading file to user computer
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  res.setHeader('Content-Type', 'image/jpeg'); // text/html, application/json
  res.setHeader('Content-Encoding', 'gzip');
  // res.setHeader('Content-Encoding', 'br'); // advanced compression algorithm

  const fileStream = fs.createReadStream(filePath);
  const gzip = zlib.createGzip();
  // const br = zlib.createBrotliCompress();

  fileStream
    .on('error', (_error) => {
      res.status(500).send('Something went wrong');
    })
    .pipe(gzip)
    .on('error', (_error) => {
      res.status(500).send('Something went wrong');
    })
    .pipe(res) // automatically call res.end() in the end
    .on('error', (_error) => {
      res.status(500).send('Something went wrong');
    });

  // The same as above but hanler generall error for file, gzip, res streams
  // pipeline(fileStream, gzip, res, (error) => {
  //   if (error) {
  //     console.log('Something went wrong');
  //     // cant send any response, because connection has already closed
  //   }
  // });

  // res.sendFile(filePath); // express method

  gzip.pipe(fs.createWriteStream(filePath + '.gzip')); // another redirection

  res.on('close', () => { // Handle any connection interruption
    fileStream.destroy(); // the file does not hang open
  });

  // Just for demonstration:
  // fileStream.on('open', () => console.log('open'));
  // fileStream.on('close', () => console.log('close'));
  // res.on('finish', () => console.log('finish')); // stream ends successfully

  // #region Parse request body in 'http' module (like req.body in express):
  // const chunks = [];

  // req.on('data', chunk => {
  //   chunks.push(chunk);
  // });

  // req.on('end', () => {
  //   const text1 = Buffer.concat(chunks).toString();
  //   const data1 = JSON.parse(text1);

  //   // #region Parse request body when a form was submitting:
  //   // like express.urlencoded({ extended: true }) middlware:
  //   // const newData = {};
  //   // const receivedData = Buffer.concat(chunks).toString(); //

  //   // receivedData
  //   //   .split('&')
  //   //   .forEach(field => {
  //   //     const [ name, value ] = field.split('=');

  //   //     newData[name] = value;
  //   //   });
  //   // #endregion
  // });

  // same as above with async iterator(for await) for async(req, res) => {}
  // for await (const chunk of req) {
  //   chunks.push(chunk);
  // }

  // const text2 = Buffer.concat(chunks).toString();
  // const data2 = JSON.parse(text2);
  // #endregion

  // #region Ptotect private files from (../../someFile):
  // const fileName = req.url.slice(1).replace(/\.\.\//g, '') || 'index.html';
  // const normalizedURL = new URL(req.url, `http://${req.headers.host}`);
  // const fileName = normalizedURL.pathname.slice(1) || 'index.html';
  // #endregion

  // #region Get search params from req.url:
  // normalizedURL.searchParams // URLSearchParams
  // normalizedURL.searchParams.getAll('someKey') // [ 'val_1', 'val_2' ]
  // normalizedURL.searchParams.get('someKey') // 'val_1'

  // params: { someKey: 'val_2', ... }
  // const params = Object.fromEntries(normalizedURL.searchParams.entries());
  // #endregion

  // #region Implement custom pipe method:
  // fileStream.on('data', (chunk) => {
  //   const canProceed = res.write(chunk);

  //   if (canProceed) {
  //     return;
  //   }

  //   fileStream.pause();

  //   res.once('drain', () => {
  //     fileStream.resume();
  //   });
  // });

  // fileStream.on('end', () => {
  //   res.end();
  //   console.log('File was successfully read and sent');

  //   // How much external memory was used to read the file
  //   console.log(
  //     process.memoryUsage().external,
  //   );
  // });
  // #endregion
});

// #region Read user input
// import readline from 'readline';

// const terminal = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// terminal.question('What is your name? ', (personName) => {
//   console.log(`Hi ${personName}!`);
//   terminal.close();
// });
// #endregion

// #region Overriding the emit() method to see which events fire on the server
// server.emit = (eventName, ...args) => {
//   console.log(eventName);
//   http.Server.prototype.emit.call(server, eventName, ...args);
// };

// // Another way to overrid the emit() method
// const emit = server.emit;

// server.emit = (eventName, ...args) => {
//   console.log(eventName);
//   emit.call(server, eventName, ...args);
// };
// #endregion

// #region Enable CORS
// Enable CORS for pre-flight OPTION request without "cors" module
// router.options('/someRoute', (req, res) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Token');
//   res.setHeader('Access-Control-Allow-Methods', 'DELETE');
//   res.end();
// });
// Enable CORS for GET request after pre-flight OPTION request
// router.get('/someRoute', (req, res) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
// });
// Enable CORS for a single someRoute with "cors" module
// router.get('/someRoute', cors(), (req, res) => {});
// #endregion

// #region Path in ES module
// const urls = new URL('./index.js', import.meta.url);
// import.meta.url --> main script to be run

// console.log(
//   import.meta.url, // file:///C:/Users/ivan/BookReviewApp/src/index.js
//   urls.pathname, // /C:/Users/ivan/BookReviewApp/src/index.js
//   path.dirname(urls.pathname), // /C:/Users/ivan/BookReviewApp/src
//   path.basename(urls.pathname), // index.js
//   path.basename(urls.pathname, path.extname(urls.pathname)), // index
//   path.extname(urls.pathname), // .js
// );
// #endregion

// #region Reading and writting a file asynchronously
// fs.readFile('./src/index.js', 'utf8', (error, fileData) => {
//   if (error?.code === 'ENOENT') {
//     console.log('File does not exist');

//     return;
//   } else if (error?.code === 'EISDIR') {
//     console.log('You are reading a folder');

//     return;
//   } else if (error) {
//     console.log('Error occurred when reading a file', error);

//     return;
//   }

//   console.log(fileData);
// });

// const fileContent = 'File content';

// fs.writeFile('./src/file.txt', fileContent, { flag: 'a+' }, (error) => {
//   if (error) {
//     console.error('Error occurred when writing a file:', error);

//     return;
//   }

//   console.log('File has been written successfully.');
// });
// #endregion
