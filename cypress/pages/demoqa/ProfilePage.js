class ProfilePage {
  elements = { userValue: () => cy.get('#userName-value') }
  userShown() { return this.elements.userValue() }
}
export default new ProfilePage()
