// cypress/plugins/index.js

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const fs = require('fs');
const path = require('path');

// Create plugins directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, '..', 'plugins'))) {
  fs.mkdirSync(path.join(__dirname, '..', 'plugins'), { recursive: true });
}

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  
  on('task', {
    log(message) {
      console.log(message);
      return null;
    }
  });
  
  return config;
}; 