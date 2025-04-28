// bcaf_api_cypress_test.js
describe('BCAF API Authentication Test', () => {
  // Test data
  const randomString = Math.random().toString(36).substring(2, 15);
  const email = `test_${randomString}@example.com`;
  const password = 'password123';
  const username = `testuser_${randomString}`;
  const name = 'Test User';
  const apiUrl = 'http://localhost:3001';
  
  // Shared state between tests
  let authToken = null;
  
  it('Should check API health endpoint', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/health`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 204]);
      cy.log('Health check passed');
    });
  });
  
  it('Should register a new user', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/users`,
      body: {
        user: {
          name: name,
          username: username,
          email: email,
          password: password,
          password_confirmation: password
        }
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.log(`Register response status: ${response.status}`);
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('token');
      authToken = response.body.token;
    });
  });
  
  it('Should login with the created user', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/users/login`,
      body: {
        user: {
          email: email,
          password: password
        }
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
      authToken = response.body.token;
    });
  });
  
  it('Should access a protected endpoint with token', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/api/user`,
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('user');
    });
  });
}); 