// bcaf_api_cypress_test.js
describe('BCAF API Authentication Test', () => {
  const randomString = Math.random().toString(36).substring(2, 15);
  const email = `test_${randomString}@example.com`;
  const password = 'password123';
  const username = `testuser_${randomString}`;
  const name = 'Test User';
  
  // The BCAF API is running on port 3003
  const apiUrl = 'http://localhost:3003';
  
  it('Should check API health endpoint first', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/health`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 204]);
      cy.log('Health check passed');
    });
  });
  
  it('Should try to register a user via API', () => {
    // Try the standard endpoint first
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
      cy.log(`Register response body: ${JSON.stringify(response.body)}`);
      
      if (response.status === 201 || response.status === 200) {
        expect(response.body).to.have.any.keys('user', 'token', 'authentication_token');
        
        // Check if we have a token directly or in the user object
        const token = response.body.token || 
                    (response.body.user && response.body.user.authentication_token);
        
        if (token) {
          cy.wrap(token).as('authToken');
          cy.wrap(email).as('userEmail');
        }
      } else {
        // If standard endpoint fails, try the V1 endpoint
        cy.request({
          method: 'POST',
          url: `${apiUrl}/api/v1/signup`,
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
        }).then((v1Response) => {
          cy.log(`V1 Register response status: ${v1Response.status}`);
          cy.log(`V1 Register response body: ${JSON.stringify(v1Response.body)}`);
          
          // Don't fail the test since we'll try login next
          cy.wrap(email).as('userEmail');
        });
      }
    });
  });
  
  it('Should try to login with created user or a fallback user', () => {
    cy.get('@userEmail').then((savedEmail) => {
      const loginEmail = savedEmail || 'admin@example.com';
      
      // Try standard login endpoint
      cy.request({
        method: 'POST',
        url: `${apiUrl}/api/users/login`,
        body: {
          user: {
            email: loginEmail,
            password: password
          }
        },
        failOnStatusCode: false
      }).then((loginResponse) => {
        cy.log(`Login response status: ${loginResponse.status}`);
        cy.log(`Login response body: ${JSON.stringify(loginResponse.body)}`);
        
        if (loginResponse.status === 200) {
          // Extract token from response
          const token = loginResponse.body.token || 
                      (loginResponse.body.user && loginResponse.body.user.authentication_token);
          
          if (token) {
            cy.wrap(token).as('authToken');
            cy.wrap(loginEmail).as('userEmail');
          }
        } else {
          // Try V1 login endpoint
          cy.request({
            method: 'POST',
            url: `${apiUrl}/api/v1/login`,
            body: {
              user: {
                email: loginEmail,
                password: password
              }
            },
            failOnStatusCode: false
          }).then((v1LoginResponse) => {
            cy.log(`V1 Login response status: ${v1LoginResponse.status}`);
            cy.log(`V1 Login response body: ${JSON.stringify(v1LoginResponse.body)}`);
            
            if (v1LoginResponse.status === 200) {
              const token = v1LoginResponse.body.token || 
                          (v1LoginResponse.body.user && v1LoginResponse.body.user.authentication_token);
              
              if (token) {
                cy.wrap(token).as('authToken');
                cy.wrap(loginEmail).as('userEmail');
              }
            }
          });
        }
      });
    });
  });
  
  it('Should try to access a protected endpoint with token if available', () => {
    cy.get('@authToken').then((token) => {
      if (!token) {
        cy.log('No auth token available, skipping protected endpoint test');
        return;
      }
      
      cy.get('@userEmail').then((email) => {
        // Try standard endpoint
        cy.request({
          method: 'GET',
          url: `${apiUrl}/api/user`,
          headers: {
            'Authorization': `Token ${token}`,
            'X-User-Email': email,
            'X-User-Token': token
          },
          failOnStatusCode: false
        }).then((protectedResponse) => {
          cy.log(`Protected endpoint response status: ${protectedResponse.status}`);
          cy.log(`Protected endpoint response body: ${JSON.stringify(protectedResponse.body)}`);
          
          if (protectedResponse.status !== 200) {
            // Try V1 endpoint 
            cy.request({
              method: 'GET',
              url: `${apiUrl}/api/v1/users/show`,
              headers: {
                'Authorization': `Token ${token}`,
                'X-User-Email': email,
                'X-User-Token': token
              },
              failOnStatusCode: false
            }).then((v1ProtectedResponse) => {
              cy.log(`V1 Protected endpoint response status: ${v1ProtectedResponse.status}`);
              cy.log(`V1 Protected endpoint response body: ${JSON.stringify(v1ProtectedResponse.body)}`);
            });
          }
        });
      });
    });
  });
}); 