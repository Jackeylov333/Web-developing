const concurrently = require('concurrently');

concurrently([
  'cd server && npm start',
  'cd client && npm start'
], {
  // concurrently options
});
