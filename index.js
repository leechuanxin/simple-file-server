import { createServer } from 'http';
import handleRequest from './handlers.js';

const PORT = process.argv[2];

const init = () => {
  if (Number.isNaN(Number(PORT)) || Number(PORT) < 0 || Number(PORT) >= 65536) {
    console.log('Please enter a valid port number >=0 and < 65536.');
  } else {
    createServer(handleRequest).listen(Number(PORT));
  }
};

init();
