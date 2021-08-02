import { createServer } from 'http';

const PORT = process.argv[2];

const handleRequest = (req, res) => {
  if (req.method === 'GET') {
    console.log('This is a GET');
  } else {
    res.writeHead(405, {});
    res.end('Method Not Allowed: Only GET requests are accepted by the resource.');
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
