class LoginPage {
  elements = {
    user: () => cy.get('#userName'),
    pass: () => cy.get('#password'),
    loginBtn: () => cy.get('#login'),
    error: () => cy.get('#name')
  }
  typeUser(u) { this.elements.user().clear().type(u) }
  typePass(p) { this.elements.pass().clear().type(p) }
  submit() { this.elements.loginBtn().click() }
  errorMsg() { return this.elements.error() }
}
export default new LoginPage()
