# language: en
Feature: LambdaTest - Input Form
  Para validar el formulario largo
  Como QA
  Quiero completar cada campo paso a paso y enviarlo

  Background:
    Given abro el formulario de LambdaTest Input Form

  Scenario: Completar todos los campos y enviar
    When escribo el nombre
    And escribo el email
    And escribo el password
    And escribo la empresa
    And escribo el website
    And selecciono un país cualquiera
    And escribo la ciudad
    And escribo la dirección 1
    And escribo la dirección 2
    And escribo el estado
    And escribo el zip
    And envío el formulario
    Then veo el mensaje de envío exitoso
