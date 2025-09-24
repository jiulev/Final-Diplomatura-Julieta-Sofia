Feature: Book Store - Login

  Background:
    Given existe un usuario registrado en Book Store

  @UI
  Scenario: Login con credenciales válidas
    Given el usuario abre la página de login de Book Store
    When ingresa el usuario de Book Store valido
    And ingresa la contraseña de Book Store valida
    And hace clic en Ingresar en Book Store
    Then ve su perfil de Book Store con el usuario valido

  @UI
  Scenario: Login con usuario no registrado
    Given el usuario abre la página de login de Book Store
    When ingresa un usuario de Book Store no registrado
    And ingresa una contraseña no registrada
    And hace clic en Ingresar en Book Store
    Then aparece el error de Book Store "Invalid username or password!"
