import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { faker } from "@faker-js/faker";
import InputFormPage from '../../../pages/lambdatest/InputFormPage';


/* =================== Shields esto es para que haga menos ruido la pagina =================== */
Cypress.on("uncaught:exception", () => false);

const NOISE = [
  "**/google-analytics.com/**",
  "**/analytics.google.com/**",
  "**/googletagmanager.com/**",
  "**/bat.bing.com/**",
  "**/px.ads.linkedin.com/**",
  "**/facebook.com/**",
  "**/connect.facebook.net/**",
  "**/ws.zoominfo.com/**",
  "**/revenuehero.io/**",
  "**/lambdatest.my.salesforce-scrt.com/**",
  "**/js.zi-scripts.com/**"
];
const blockNoise = () => {
  NOISE.forEach((p) =>
    cy.intercept({ url: p }, { statusCode: 204, body: "" }).as(`blocked_${btoa(p).slice(0, 8)}`)
  );
};

/* para que vaya mas lebnto porque esta rompiendo asi me doy cuenta*/
const bumpConfig = () => {
  Cypress.config("defaultCommandTimeout", 20000); // +timeout
  Cypress.config("retries", { runMode: 2, openMode: 0 }); // reintentos en cypress run
  Cypress.config("waitForAnimations", true);
  Cypress.config("animationDistanceThreshold", 10);
};

/* uso faker */
let DATA;
const buildData = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password: faker.internet.password({ length: 12 }),
  company: faker.company.name(),
  website: faker.internet.domainName(),
  city: faker.location.city(),
  address1: faker.location.streetAddress(),
  address2: faker.location.secondaryAddress(),
  state: faker.location.state(),
  zip: (faker.location.zipCode().replace(/\D/g, "").slice(0, 8) || "1000")
});

/* helpers */
function slowFill(selector, value, alias) {
  cy.get(selector, { timeout: 20000 }).as(alias);

  cy.get(`@${alias}`).should("exist");
  cy.get(`@${alias}`).should(($el) => expect(Cypress.dom.isDetached($el)).to.eq(false));
  cy.get(`@${alias}`).scrollIntoView();
  cy.wait(150);

  cy.get(`@${alias}`).should("be.visible");
  cy.get(`@${alias}`).click({ force: true });
  cy.wait(120);

  cy.get(`@${alias}`).type("{selectall}{backspace}", { delay: 0 });
  cy.wait(120);

  cy.get(`@${alias}`).type(value, { delay: 35 });

  cy.get(`@${alias}`).should("have.value", value);
  cy.wait(150);
}

function pickAnyCountry() {
  const alias = "countrySelect";
  cy.get("select[name='country']", { timeout: 20000 }).as(alias);

  cy.get(`@${alias}`).should("exist");
  cy.get(`@${alias}`).scrollIntoView();
  cy.wait(150);
  cy.get(`@${alias}`).should("be.visible");

  cy.get(`@${alias}`).then(($sel) => {
    const $opts = $sel.find("option");
    const ar = Array.from($opts).find((o) => o.value === "AR");
    if (ar) {
      cy.get(`@${alias}`).select("AR");
      cy.get(`@${alias}`).should("have.value", "AR");
    } else {
      const valid = Array.from($opts).filter((o) => o.value && !o.disabled);
      const first = valid[0] || $opts[1];
      cy.get(`@${alias}`).select(first.value);
      cy.get(`@${alias}`).should("have.value", first.value);
    }
  });

  cy.wait(150);
}

/* los pasos de la feature */
Given("abro el formulario de LambdaTest Input Form", () => {
  bumpConfig();
  blockNoise();
  DATA = buildData();

  cy.log("➡️ Abriendo Input Form (desde env.json via PageObject)");
  // ahora delegamos la navegación y limpieza al PageObject
  InputFormPage.visit();

  // si necesitás, dejá una espera corta
  cy.wait(200);
});

When("escribo el nombre", () => {
  slowFill("#name", DATA.name, "name");
});

When("escribo el email", () => {
  slowFill("#inputEmail4", DATA.email, "email");
});

When("escribo el password", () => {
  slowFill("#inputPassword4", DATA.password, "password");
});

When("escribo la empresa", () => {
  slowFill("#company", DATA.company, "company");
});

When("escribo el website", () => {
  slowFill("#websitename", DATA.website, "website");
});

When("selecciono un país cualquiera", () => {
  pickAnyCountry();
});

When("escribo la ciudad", () => {
  slowFill("#inputCity", DATA.city, "city");
});

When("escribo la dirección 1", () => {
  slowFill("#inputAddress1", DATA.address1, "addr1");
});

When("escribo la dirección 2", () => {
  slowFill("#inputAddress2", DATA.address2, "addr2");
});

When("escribo el estado", () => {
  slowFill("#inputState", DATA.state, "state");
});

When("escribo el zip", () => {
  slowFill("#inputZip", DATA.zip, "zip");
});

When("envío el formulario", () => {
  cy.log("📨 Enviando formulario (romper cadena)");
  cy.get("form#seleniumform").as("form");

  cy.get("@form").find('button[type="submit"]:visible').as("submitBtn");

  cy.get("@submitBtn").scrollIntoView();
  cy.wait(200);

  cy.get("@submitBtn").should("be.visible");
  cy.wait(150);

  cy.get("@submitBtn").click({ force: true });
  cy.wait(300);
});

Then("veo el mensaje de envío exitoso", () => {
  cy.log("🟢 Verificando mensaje de éxito");
  cy.get("p.success-msg", { timeout: 20000 })
    .should("be.visible")
    .and("contain.text", "Thanks for contacting us");
  cy.wait(200);
});
