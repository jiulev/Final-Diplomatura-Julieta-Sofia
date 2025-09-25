import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import DataGenerator from '../../../../support/DataGenerator'

const envKey = Cypress.env('ENV') || 'DEV'
const baseUrl = Cypress.env(envKey).url_petstore_api

let petId
let petName

const getHeaders = () =>
  Cypress.env('headers') || {
    'Content-Type': 'application/json',
    accept: 'application/json',
    api_key: 'special-key',
  }

// ---- helpers de polling ----
const waitForPetToExist = (id, retries = 8, delay = 800) => {
  const tryOnce = (n) =>
    cy
      .request({
        method: 'GET',
        url: `${baseUrl}/pet/${id}`,
        headers: getHeaders(),
        failOnStatusCode: false,
      })
      .then((r) => {
        if (r.status === 200) return r
        if (n <= 0) throw new Error(`Pet ${id} not found after retries`)
        return cy.wait(delay).then(() => tryOnce(n - 1))
      })
  return tryOnce(retries)
}

const waitForPetToBeGone = (id, retries = 10, delay = 800) => {
  const tryOnce = (n) =>
    cy
      .request({
        method: 'GET',
        url: `${baseUrl}/pet/${id}`,
        headers: getHeaders(),
        failOnStatusCode: false,
      })
      .then((r) => {
        if (r.status === 404) return r
        if (n <= 0) throw new Error(`Pet ${id} still exists after retries`)
        return cy.wait(delay).then(() => tryOnce(n - 1))
      })
  return tryOnce(retries)
}

// ---- steps ----
Given('defino headers comunes de Petstore', () => {
  Cypress.env('headers', getHeaders())
})

Given('ya existe una mascota creada en Petstore', () => {
  petId = Date.now()
  petName = DataGenerator.getNombre()

  cy.request({
    method: 'POST',
    url: `${baseUrl}/pet`,
    headers: getHeaders(),
    body: { id: petId, name: petName, status: 'available' },
    failOnStatusCode: false,
  }).then((r) => {
    expect([200, 201]).to.include(r.status)
  })

  // asegurar persistencia antes de seguir
  waitForPetToExist(petId)
})

When('creo una nueva mascota con datos generados', () => {
  petId = Date.now()
  petName = DataGenerator.getNombre()

  cy.request({
    method: 'POST',
    url: `${baseUrl}/pet`,
    headers: getHeaders(),
    body: { id: petId, name: petName, status: 'available' },
    failOnStatusCode: false,
  }).then((r) => {
    expect([200, 201]).to.include(r.status)
  })
})

Then('puedo consultar esa mascota por su id y obtener status 200', () => {
  waitForPetToExist(petId).its('status').should('eq', 200)
})

When('actualizo el nombre de la mascota', () => {
  const newName = DataGenerator.getNombre()

  cy.request({
    method: 'PUT',
    url: `${baseUrl}/pet`,
    headers: getHeaders(),
    body: { id: petId, name: newName, status: 'available' },
    failOnStatusCode: false,
  }).then((r) => {
    expect([200, 201]).to.include(r.status)
    petName = newName
  })
})

Then('la mascota refleja el nuevo nombre', () => {
  waitForPetToExist(petId).then((r) => {
    expect(r.body).to.have.property('name', petName)
  })
})

When('elimino la mascota creada', () => {
  // primero nos aseguramos que existe
  waitForPetToExist(petId)

  // el DELETE en esta API pública es flaky: no asertamos el status aquí
  cy.request({
    method: 'DELETE',
    url: `${baseUrl}/pet/${petId}`,
    headers: getHeaders(),
    failOnStatusCode: false,
  })
})

Then('al consultar por id obtengo 404', () => {
  waitForPetToBeGone(petId).its('status').should('eq', 404)
})
