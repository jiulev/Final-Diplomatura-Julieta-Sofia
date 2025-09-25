class InputFormPage {
  // obtenemos la URL en tiempo de ejecución desde env.json (Cypress.env)
  get url() {
    return (
      Cypress.env("url_lambdatest_form") ||
      "https://www.lambdatest.com/selenium-playground/input-form-demo"
    );
  }

  // Selectores del HTML
  name = "#name";
  email = "#inputEmail4";
  password = "#inputPassword4";
  company = "#company";
  website = "#websitename";
  country = "select[name='country']";
  city = "#inputCity";
  address1 = "#inputAddress1";
  address2 = "#inputAddress2";
  state = "#inputState";
  zip = "#inputZip";
  submitBtn = 'button[type="submit"]';
  successMsg = "p.success-msg";

  visit() {
    // visit usa la URL tomada desde env.json (o fallback)
    cy.visit(this.url, { failOnStatusCode: false });

    // espera a carga completa
    cy.window({ timeout: 20000 }).its("document.readyState").should("eq", "complete");

    // Cerrar cookies / ocultar chat si aparecen
    cy.get("body").then(($b) => {
      const cookieBtn = "#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll";
      if ($b.find(cookieBtn).length) cy.get(cookieBtn).click({ force: true });

      const chatBtn = "#embeddedMessagingConversationButton";
      if ($b.find(chatBtn).length)
        cy.get(chatBtn).invoke("attr", "style", "display:none !important");
    });

    // asegurar que el formulario existe y es visible
    cy.get("form#seleniumform", { timeout: 20000 }).should("be.visible");
  }
}

export default new InputFormPage();
