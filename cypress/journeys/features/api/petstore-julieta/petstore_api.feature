Feature: Petstore - CRUD básico de mascotas

  Background:
    Given defino headers comunes de Petstore

  @API @Petstore
  Scenario: Crear y consultar una mascota
    When creo una nueva mascota con datos generados
    Then puedo consultar esa mascota por su id y obtener status 200

  @API @Petstore
  Scenario: Crear y eliminar mascota
    Given ya existe una mascota creada en Petstore
    When elimino la mascota creada
    Then al consultar por id obtengo 404
