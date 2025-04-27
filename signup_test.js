// Cypress test file for testing signup process with Express API

describe('Signup Process Tests', () => {
  const apiUrl = 'http://localhost:3001';
  const testEmail = `test_${Math.random().toString(36).substring(2, 10)}@example.com`;
  const testPassword = 'password123';
  const testUsername = `testuser_${Math.random().toString(36).substring(2, 10)}`;
  let authToken = '';

  before(() => {
    // Clear any cached data
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should check API health', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/health`
    }).then((response) => {
      // Should return 200
      expect(response.status).to.eq(200);
      
      // Response should contain status information
      expect(response.body).to.have.property('status', 'healthy');
      expect(response.body).to.have.property('timestamp');
      expect(response.body).to.have.property('authentication', 'mock enabled');
    });
  });

  it('should register a new user', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/users`,
      body: {
        user: {
          name: 'Cypress Signup Test User',
          username: testUsername,
          email: testEmail,
          password: testPassword,
          password_confirmation: testPassword
        }
      }
    }).then((response) => {
      // Should return 201 Created
      expect(response.status).to.eq(201);
      
      // Response should contain user data and token
      expect(response.body).to.have.property('user');
      expect(response.body).to.have.property('token');
      
      // Save token for future requests
      authToken = response.body.token;
      
      // Verify user data
      expect(response.body.user).to.have.property('email', testEmail);
      expect(response.body.user).to.have.property('username', testUsername);
    });
  });

  it('should login with registered credentials', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/users/login`,
      body: {
        user: {
          email: testEmail,
          password: testPassword
        }
      }
    }).then((response) => {
      // Should return 200 OK
      expect(response.status).to.eq(200);
      
      // Response should contain user data and token
      expect(response.body).to.have.property('user');
      expect(response.body).to.have.property('token');
      
      // Update token
      authToken = response.body.token;
      
      // Verify user data
      expect(response.body.user).to.have.property('email', testEmail);
    });
  });

  it('should access protected routes with token', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/api/user`,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }).then((response) => {
      // Should return 200 OK
      expect(response.status).to.eq(200);
      
      // Response should contain user data
      expect(response.body).to.have.property('user');
    });
  });

  it('should fail accessing protected routes without token', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/api/user`,
      failOnStatusCode: false
    }).then((response) => {
      // Should return 401 Unauthorized
      expect(response.status).to.eq(401);
    });
  });
}); 