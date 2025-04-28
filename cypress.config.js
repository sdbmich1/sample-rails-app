const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    supportFile: 'cypress/support/index.js',
    specPattern: '*.js',
    baseUrl: 'http://localhost:3001',
    experimentalInteractiveRunEvents: true,
  },
}); 