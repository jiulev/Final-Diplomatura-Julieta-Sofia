import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import DataGenerator from '../../../support/DataGenerator'
import LoginPage from '../../../pages/demoqa/LoginPage'
import ProfilePage from '../../../pages/demoqa/ProfilePage'

const envKey = Cypress.env('ENV') || 'DEV'
const bookstoreUrl = Cypress.env(envKey).url_bookstore
const apiBase = Cypress.env(envKey).url_bookstore_api

Given('existe un usuario registrado en Book Store', () => {
  const user   = DataGenerator.getUsername()
  const pass   = DataGenerator.getStrongPassword()
  const unUser = DataGenerator.getUsername()
  const unPass = DataGenerator.getStrongPassword()

  Cypress.env('BOOK_USER', user)
  Cypress.env('BOOK_PASS', pass)
  Cypress.env('BOOK_USER_UNREG', unUser)
  Cypress.env('BOOK_PASS_UNREG', unPass)

  cy.request({
    method: 'POST',
    url: `${apiBase}/User`,
    body: { userName: user, password: pass },
    failOnStatusCode: false
  }).then((r) => {
    // 201 = creado, 406 = ya existía con misma pass (también válido para seguir)
    expect(r.status).to.be.oneOf([201, 406])
    if (r.status !== 201) cy.log(`Create user response: ${JSON.stringify(r.body)}`)
  })
})

Given('el usuario abre la página de login de Book Store', () => {
  cy.visit(bookstoreUrl)
})

When('ingresa el usuario de Book Store valido', () => {
  LoginPage.typeUser(Cypress.env('BOOK_USER'))
})

When('ingresa la contraseña de Book Store valida', () => {
  LoginPage.typePass(Cypress.env('BOOK_PASS'))
})

When('ingresa un usuario de Book Store no registrado', () => {
  LoginPage.typeUser(Cypress.env('BOOK_USER_UNREG'))
})

When('ingresa una contraseña no registrada', () => {
  LoginPage.typePass(Cypress.env('BOOK_PASS_UNREG'))
})

When('hace clic en Ingresar en Book Store', () => {
  LoginPage.submit()
})

Then('ve su perfil de Book Store con el usuario valido', () => {
  cy.url().should('include', '/profile')
  ProfilePage.userShown().should('have.text', Cypress.env('BOOK_USER'))
})

Then('aparece el error de Book Store {string}', (msg) => {
  LoginPage.errorMsg().should('contain.text', msg)
})
