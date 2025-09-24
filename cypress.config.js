const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild");

async function setupNodeEvents(on, config) {
  await preprocessor.addCucumberPreprocessorPlugin(on, config);
  config.env.tags = process.env.TAGS || config.env.tags || "";
  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin.default(config)],
    })
  );
  return config;
}

module.exports = defineConfig({
  env: { tags: "" },
  e2e: {
    setupNodeEvents,
    specPattern: "cypress/journeys/**/features/**/*.feature",
    chromeWebSecurity: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    watchForFileChanges: false
  },
});
