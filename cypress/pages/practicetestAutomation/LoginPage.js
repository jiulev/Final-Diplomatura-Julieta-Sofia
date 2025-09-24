

class LoginPage {
    elements = {
        usernameInput: () => cy.get('#username'),
        passwordInput: () => cy.get('#password'),
        loginButton: () => cy.get('#submit'),
        errorMessage: () => cy.get('#error')

    }

    enterUsername(username) {
        this.elements.usernameInput().type(username);
    }
    
    enterPassword(password) {
        this.elements.passwordInput().type(password);
    }
    clickLogin() {
        this.elements.loginButton().click();
    }

    getErrorMessage() {
        return this.elements.errorMessage();
    }   

    successfulLogin(username, password) {
        this.enterUsername(username);
        this.enterPassword(password);
        this.clickLogin();
    }
}
export default new LoginPage();