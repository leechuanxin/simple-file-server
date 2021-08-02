import { createServer } from 'http';
import { readFile } from 'fs';

const PORT = process.argv[2];

const handleRequest = (req, res) => {
  let url = `.${req.url}`;
  if (req.method === 'GET') {
    if (url.indexOf('/') === url.length - 1) {
      url += 'index.html';
    }

    readFile(url, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          readFile('./404.html', (err404, content404) => {
            res.writeHead(404, {});
            res.end(content404, 'utf-8');
          });
        } else {
          res.writeHead(500, {});
          res.end(`Sorry, please check with the site admin for error ${err.code} .\n`, 'utf-8');
        }
      } else {
        // Set the response code to 200 (i.e. OK)
        res.writeHead(200, {});
        // Send the response with the file content in utf-8 format
        res.end(content, 'utf-8');
      }
    });
  } else {
    res.writeHead(405, {});
    res.end('Method Not Allowed: Only GET requests are accepted by the resource.', 'utf-8');
  }
};

const init = () => {
  if (Number.isNaN(Number(PORT)) || Number(PORT) < 0 || Number(PORT) >= 65536) {
    console.log('Please enter a valid port number >=0 and < 65536.');
  } else {
    createServer(handleRequest).listen(Number(PORT));
  }
};

init();
