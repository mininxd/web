import { io } from 'socket.io-client';
const socket = io(import.meta.env.VITE_SOCKET);


// get latest upstream for logs network name
export function queryLogs(search = "", limit = 5, offset = 0) {
  return new Promise((resolve, reject) => {
    socket.once('querylog:update', (data) => {
      resolve(data);
    });
    socket.once('querylog:error', (err) => {
      reject(err);
    });

    if (socket.connected) {
      socket.emit('getQueryLog', { search, limit, offset });
    } else {
      socket.once('connect', () => {
        socket.emit('getQueryLog', { search, limit, offset });
      });
    }
  });
}

// Example JSON data (queryLogs) :
/*
[
  {
  "client_proto": "doh",
  "client_whois": "network name"
  }
]
*/



// Top blocked domains stats
export function stats() {
  return new Promise((resolve, reject) => {
    socket.once('stats:update', (data) => {
      resolve(data);
    });
    socket.once('stats:error', (err) => {
      reject(err);
    });

    if (socket.connected) {
      socket.emit('getStats');
    } else {
      socket.once('connect', () => {
        socket.emit('getStats');
      });
    }
  });
}


// Example JSON data (stats) :
/*
{
  "top_blocked_domains": {
      "www.google.com": 10000,
      "www.example.com": 20000
    }
}

*/