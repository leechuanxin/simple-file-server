import { readFile } from 'fs';
import { extname } from 'path';

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm',
};
const OCTET_STREAM_CONTENT_TYPE = 'application/octet-stream';
const BANANA_STRING = 'hello banana!';
const EASTER_EGG_HEADER = {
  'rocket-academy-secret-word': 'blastoff',
};

/**
 * Handles status code 200, ie. OK
 * @param  {object} res - response object from Server object
 * @param  {string} content - contents of the file read
 * @return {undefined}
 */
const handle200 = (res, content) => {
  // Set the response code to 200 (i.e. OK)
  res.writeHead(200, EASTER_EGG_HEADER);
  // Send the response with the file content in utf-8 format
  res.end(content, 'utf-8');
};

/**
 * Handles ENOENT cases when files are not found.
 * @param  {object} res - response object from Server object
 * @return {undefined}
 */
const handle404 = (res) => {
  readFile('./404.html', (err, content) => {
    res.writeHead(404, EASTER_EGG_HEADER);
    res.end(content, 'utf-8');
  });
};

/**
 * Handles 405 cases, request method not allowed
 * @param  {object} res - response object from Server object
 * @return {undefined}
 */
const handle405 = (res) => {
  res.writeHead(405, EASTER_EGG_HEADER);
  res.end('Method Not Allowed: Only GET requests are accepted by the resource.', 'utf-8');
};

/**
 * Handles 415 cases, unsupported media type
 * @param  {object} res - response object from Server object
 * @param  {string} filetype - filetype as retrieved from path.extname()
 * @return {undefined}
 */
const handle415 = (res, filetype) => {
  // Set the response code to 415 (i.e. Unsupported Media Type)
  res.writeHead(415, EASTER_EGG_HEADER);
  res.end(`Sorry, we cannot load applications with the extension ${filetype}.`, 'utf-8');
};

/**
 * Handles status code 500, usually problems reading file
 * @param  {object} res - response object from Server object
 * @param  {string} code - error code from reading file
 * @return {undefined}
 */
const handle500 = (res, code) => {
  res.writeHead(500, EASTER_EGG_HEADER);
  res.end(`Sorry, please check with the site admin for error ${code} .\n`, 'utf-8');
};

/**
 * Handles incoming requests, delivers content based on status code
 * @param  {object} res - response object from Server object
 * @param  {string} code - error code from reading file
 * @return {undefined}
 */
const handleRequest = (req, res) => {
  let url = `.${req.url}`;
  if (req.method === 'GET') {
    if (url.indexOf('/') === url.length - 1) {
      url += 'index.html';
    }

    const filetype = String(extname(url)).toLowerCase();
    const contentType = MIME_TYPES[filetype] || OCTET_STREAM_CONTENT_TYPE;

    if (url.indexOf('/banana') === url.length - 7) {
      handle200(res, BANANA_STRING);
    } else if (contentType === OCTET_STREAM_CONTENT_TYPE) {
      handle415(res, filetype);
    } else {
      readFile(url, (err, content) => {
        if (err) {
          if (err.code === 'ENOENT') {
            handle404(res);
          } else {
            handle500(res, err.code);
          }
        } else {
          handle200(res, content);
        }
      });
    }
  } else {
    handle405(res);
  }
};

export default handleRequest;
