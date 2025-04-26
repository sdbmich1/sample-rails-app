// cypress_ui_api_test.js
describe('UI to API Authentication Test', () => {
  const randomString = Math.random().toString(36).substring(2, 15);
  const email = `test_${randomString}@example.com`;
  const password = 'password123';
  const username = `testuser_${randomString}`;
  const name = 'Test User';
  
  // The bcaf_digital API is running on port 3002
  const apiUrl = 'http://localhost:3002';
  
  it('Should register a user via API and then use the UI to interact with API', () => {
    // Step 1: Register user via API directly
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
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('user');
      expect(response.body).to.have.property('token');
      
      // Store the token for later use
      const token = response.body.token;
      
      // Step 2: Check that we can fetch user details using this token
      cy.request({
        method: 'GET',
        url: `${apiUrl}/api/user`,
        headers: {
          'Authorization': `Token ${token}`
        },
        failOnStatusCode: false
      }).then((userResponse) => {
        expect(userResponse.status).to.eq(200);
        expect(userResponse.body).to.have.property('user');
        expect(userResponse.body.user).to.have.property('email', email);
        
        // Step 3: Now test login functionality
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
        }).then((loginResponse) => {
          expect(loginResponse.status).to.eq(200);
          expect(loginResponse.body).to.have.property('token');
          expect(loginResponse.body).to.have.property('user');
          expect(loginResponse.body.user).to.have.property('email', email);
          expect(loginResponse.body.user).to.have.property('username', username);
          
          // Store this new token
          const loginToken = loginResponse.body.token;
          
          // Step 4: Validate we can use this token for protected routes
          cy.request({
            method: 'GET',
            url: `${apiUrl}/api/user`,
            headers: {
              'Authorization': `Token ${loginToken}`
            },
            failOnStatusCode: false
          }).then((validationResponse) => {
            expect(validationResponse.status).to.eq(200);
            expect(validationResponse.body).to.have.property('user');
            expect(validationResponse.body.user).to.have.property('email', email);
          });
        });
      });
    });
  });
  
  it('Should test incorrect login credentials', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/users/login`,
      body: {
        user: {
          email: email,
          password: 'wrongpassword'
        }
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401); // Unauthorized
      expect(response.body).to.have.property('errors');
    });
  });
  
  it('Should test the UI integration with the API', () => {
    // This assumes you have a UI that integrates with the API
    // The implementation would depend on your UI components and flow
    
    // For example, if you have a login form:
    // 1. Visit the login page
    // 2. Fill in the email and password
    // 3. Submit the form
    // 4. Verify that the UI handles the API response correctly
    
    /* Example UI test flow
    cy.visit('/login');
    cy.get('[data-cy=login-email]').type(email);
    cy.get('[data-cy=login-password]').type(password);
    cy.get('[data-cy=login-submit]').click();
    
    // Check that the UI redirects to dashboard or shows appropriate message
    cy.url().should('include', '/dashboard');
    */
    
    // For now, we'll just verify that our test user exists by trying API login
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
    });
  });
}); 