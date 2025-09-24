import { fakerES as faker } from '@faker-js/faker';

class DataGenerator {
    constructor() {
        this.faker = faker;
    }

    getNombre() { return this.faker.person.firstName(); }
    getApellido() { return this.faker.person.lastName(); }
    getEmail() { return this.faker.internet.email(); }
    getPassword() { return this.faker.internet.password(); }
    getRandomNumber(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    getCompany() { return this.faker.company.name(); }
    getAddress() { return this.faker.location.streetAddress(); }
    getCountry() { return this.faker.location.country(); }
    getState() { return this.faker.location.state(); }
    getCity() { return this.faker.location.city(); }
    getZipCode() { return this.faker.location.zipCode(); }
    getMobileNumber() { return this.faker.phone.number('549351####'); }

  
    getUsername() {
        return `u_${this.faker.string.alphanumeric({ length: 8 })}`.toLowerCase();
    }

    getStrongPassword() {
        const base = this.faker.string.alphanumeric({ length: 6 });
        // Cumple: 1 mayúscula, 1 minúscula, 1 número y 1 símbolo
        return `Aa1!${base}`;
    }
}

export default new DataGenerator();
