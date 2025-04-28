// Cypress test for library borrowing process with Express API

describe('Library Borrowing Process Tests', () => {
  const apiUrl = 'http://localhost:3001';
  const testEmail = `test_${Math.random().toString(36).substring(2, 10)}@example.com`;
  const testPassword = 'password123';
  const testUsername = `testuser_${Math.random().toString(36).substring(2, 10)}`;
  let authToken = '';

  // Mock data
  const libraryData = {
    library: {
      id: 'san-francisco',
      name: 'San Francisco Public Library',
      address: '100 Larkin St, San Francisco, CA 94102',
      phone: '(415) 557-4400'
    },
    items: [
      {
        id: 'captain-america-123',
        title: 'Captain America: The First Avenger',
        author: 'Joe Simon & Jack Kirby',
        genre: 'Comics',
        available: true,
        libraryId: 'san-francisco',
        coverImage: 'https://example.com/captain-america.jpg'
      },
      {
        id: 'captain-america-456',
        title: 'Captain America and the Struggle for Tomorrow',
        author: 'Steve Rogers',
        genre: 'Comics',
        available: true,
        libraryId: 'san-francisco',
        coverImage: 'https://example.com/captain-america-2.jpg'
      }
    ]
  };

  const searchResults = {
    query: 'Captain America',
    libraryId: 'san-francisco',
    results: [
      {
        id: 'captain-america-123',
        title: 'Captain America: The First Avenger',
        author: 'Joe Simon & Jack Kirby',
        genre: 'Comics',
        available: true,
        libraryId: 'san-francisco',
        coverImage: 'https://example.com/captain-america.jpg'
      },
      {
        id: 'captain-america-456',
        title: 'Captain America and the Struggle for Tomorrow',
        author: 'Steve Rogers',
        genre: 'Comics',
        available: true,
        libraryId: 'san-francisco',
        coverImage: 'https://example.com/captain-america-2.jpg'
      }
    ]
  };

  const bookDetails = {
    id: 'captain-america-123',
    title: 'Captain America: The First Avenger',
    author: 'Joe Simon & Jack Kirby',
    genre: 'Comics',
    available: true,
    libraryId: 'san-francisco',
    coverImage: 'https://example.com/captain-america.jpg'
  };

  const borrowResponse = {
    success: true,
    message: 'Book borrowed successfully',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  };

  const borrowedBooks = {
    borrowed: [
      {
        id: `borrow-${Date.now()}`,
        userId: 1,
        bookId: 'captain-america-123',
        libraryId: 'san-francisco',
        borrowedAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        book: bookDetails
      }
    ]
  };

  const returnResponse = {
    success: true,
    message: 'Book returned successfully'
  };

  before(() => {
    // Setup API mocks
    cy.intercept('GET', '/api/libraries/san-francisco/catalog', {
      statusCode: 200,
      body: libraryData
    }).as('getLibraryCatalog');

    cy.intercept('GET', '/api/search*', {
      statusCode: 200,
      body: searchResults
    }).as('searchBooks');

    cy.intercept('GET', '/api/books/captain-america-123', {
      statusCode: 200,
      body: bookDetails
    }).as('getBookDetails');

    cy.intercept('POST', '/api/borrow', {
      statusCode: 201,
      body: borrowResponse
    }).as('borrowBook');

    cy.intercept('GET', '/api/user/borrowed', {
      statusCode: 200,
      body: borrowedBooks
    }).as('getBorrowedBooks');

    cy.intercept('POST', '/api/return', {
      statusCode: 200,
      body: returnResponse
    }).as('returnBook');

    // Clear any cached data
    cy.clearCookies();
    cy.clearLocalStorage();
    
    // Register and login to get an auth token
    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/users`,
      body: {
        user: {
          name: 'Test SF Library User',
          username: testUsername,
          email: testEmail,
          password: testPassword,
          password_confirmation: testPassword,
          library: 'San Francisco Public Library' // Specifying the library
        }
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      
      // Login with created user
      cy.request({
        method: 'POST',
        url: `${apiUrl}/api/users/login`,
        body: {
          user: {
            email: testEmail,
            password: testPassword
          }
        }
      }).then((loginResponse) => {
        expect(loginResponse.status).to.eq(200);
        authToken = loginResponse.body.token;
      });
    });
  });

  it('should be able to access library catalog', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/api/libraries/san-francisco/catalog`,
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.wait('@getLibraryCatalog');
      expect(response.body).to.have.property('items');
      expect(response.body.items).to.have.length(2);
      expect(response.body.items[0].title).to.include('Captain America');
    });
  });

  it('should be able to search for Captain America books', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/api/search`,
      qs: {
        query: 'Captain America',
        library: 'san-francisco'
      },
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.wait('@searchBooks');
      expect(response.body).to.have.property('results');
      expect(response.body.results).to.have.length(2);
      expect(response.body.results[0].title).to.include('Captain America');
    });
  });

  it('should be able to get book details', () => {
    const bookId = 'captain-america-123';
    
    cy.request({
      method: 'GET',
      url: `${apiUrl}/api/books/${bookId}`,
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.wait('@getBookDetails');
      expect(response.body).to.have.property('title');
      expect(response.body.title).to.include('Captain America');
    });
  });

  it('should be able to borrow a book', () => {
    const bookId = 'captain-america-123';
    
    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/borrow`,
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: {
        bookId: bookId,
        libraryId: 'san-francisco'
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.wait('@borrowBook');
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('message').that.includes('borrowed successfully');
    });
  });

  it('should be able to view borrowed books', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/api/user/borrowed`,
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.wait('@getBorrowedBooks');
      expect(response.body).to.have.property('borrowed');
      expect(response.body.borrowed).to.have.length(1);
      expect(response.body.borrowed[0].book.title).to.include('Captain America');
    });
  });

  it('should be able to return a book', () => {
    const bookId = 'captain-america-123';
    
    cy.request({
      method: 'POST',
      url: `${apiUrl}/api/return`,
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: {
        bookId: bookId,
        libraryId: 'san-francisco'
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.wait('@returnBook');
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('message').that.includes('returned successfully');
    });
  });
}); 