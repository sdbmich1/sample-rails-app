// Cypress test for library borrowing process with complete mocking

describe('SFPL Library Borrowing Process Tests', () => {
  // Authentication token for the test
  const authToken = 'mock_jwt_token_for_testing';

  before(() => {
    // Setup all API mocks
    cy.setupLibraryMocks();
  });

  it('should register at the San Francisco Public Library', () => {
    cy.intercept('POST', '/api/users').as('registerRequest');
    
    cy.request({
      method: 'POST',
      url: '/api/users',
      failOnStatusCode: false,
      body: {
        user: {
          name: 'Test SF Library User',
          username: 'testuser_sf123',
          email: 'test_sf@example.com',
          password: 'password123',
          password_confirmation: 'password123',
          library: 'San Francisco Public Library'
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('user');
      expect(response.body).to.have.property('token');
    });
  });

  it('should login with San Francisco Public Library credentials', () => {
    cy.intercept('POST', '/api/users/login').as('loginRequest');
    
    cy.request({
      method: 'POST',
      url: '/api/users/login',
      failOnStatusCode: false,
      body: {
        user: {
          email: 'test_sf@example.com',
          password: 'password123'
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('user');
      expect(response.body).to.have.property('token');
    });
  });

  it('should browse the San Francisco Public Library catalog', () => {
    cy.intercept('GET', '/api/libraries/san-francisco/catalog').as('catalogRequest');
    
    cy.request({
      method: 'GET',
      url: '/api/libraries/san-francisco/catalog',
      failOnStatusCode: false,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('library');
      expect(response.body.library.name).to.eq('San Francisco Public Library');
      expect(response.body).to.have.property('items');
      expect(response.body.items).to.have.length(2);
      expect(response.body.items.some(item => item.title.includes('Captain America'))).to.be.true;
    });
  });

  it('should search for Captain America books', () => {
    cy.intercept('GET', '/api/search*').as('searchRequest');
    
    cy.request({
      method: 'GET',
      url: '/api/search',
      failOnStatusCode: false,
      qs: {
        query: 'Captain America',
        library: 'san-francisco'
      },
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('results');
      expect(response.body.results).to.have.length.greaterThan(0);
      
      // Find the Captain America book to borrow
      const captainAmericaBook = response.body.results.find(book => 
        book.title === 'Captain America: The First Avenger'
      );
      expect(captainAmericaBook).to.not.be.undefined;
      expect(captainAmericaBook.id).to.eq('captain-america-123');
    });
  });

  it('should view Captain America book details', () => {
    const bookId = 'captain-america-123';
    cy.intercept('GET', `/api/books/${bookId}`).as('bookDetailsRequest');
    
    cy.request({
      method: 'GET',
      url: `/api/books/${bookId}`,
      failOnStatusCode: false,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('title');
      expect(response.body.title).to.include('Captain America');
      expect(response.body).to.have.property('author');
      expect(response.body).to.have.property('available', true);
    });
  });

  it('should borrow the Captain America book', () => {
    const bookId = 'captain-america-123';
    cy.intercept('POST', '/api/borrow').as('borrowRequest');
    
    cy.request({
      method: 'POST',
      url: '/api/borrow',
      failOnStatusCode: false,
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: {
        bookId: bookId,
        libraryId: 'san-francisco'
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('message').to.include('borrowed successfully');
      expect(response.body).to.have.property('dueDate');
    });
  });

  it('should view borrowed books and see Captain America', () => {
    cy.intercept('GET', '/api/user/borrowed').as('borrowedBooksRequest');
    
    cy.request({
      method: 'GET',
      url: '/api/user/borrowed',
      failOnStatusCode: false,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('borrowed');
      expect(response.body.borrowed).to.have.length(1);
      
      const borrowedCaptainAmerica = response.body.borrowed.find(item => 
        item.bookId === 'captain-america-123'
      );
      expect(borrowedCaptainAmerica).to.not.be.undefined;
      expect(borrowedCaptainAmerica.book.title).to.include('Captain America');
    });
  });

  it('should return the Captain America book', () => {
    const bookId = 'captain-america-123';
    cy.intercept('POST', '/api/return').as('returnRequest');
    
    cy.request({
      method: 'POST',
      url: '/api/return',
      failOnStatusCode: false,
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: {
        bookId: bookId,
        libraryId: 'san-francisco'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('message').to.include('returned successfully');
    });
  });
}); 