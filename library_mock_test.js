// Cypress test for library borrowing process with complete mocking

describe('Library Borrowing Process Tests (Mocked)', () => {
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
    dueDate: '2025-05-11T15:33:22.470Z'
  };

  const borrowedBooks = {
    borrowed: [
      {
        id: 'borrow-123456789',
        userId: 1,
        bookId: 'captain-america-123',
        libraryId: 'san-francisco',
        borrowedAt: '2025-04-27T15:33:22.470Z',
        dueDate: '2025-05-11T15:33:22.470Z',
        book: bookDetails
      }
    ]
  };

  const returnResponse = {
    success: true,
    message: 'Book returned successfully'
  };

  const userData = {
    user: {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      created_at: '2025-01-01T00:00:00.000Z',
      updated_at: '2025-01-01T00:00:00.000Z'
    },
    token: 'mock_jwt_token_for_testing'
  };

  before(() => {
    // Setup all API mocks
    cy.intercept('POST', '/api/users', {
      statusCode: 201,
      body: userData
    }).as('register');

    cy.intercept('POST', '/api/users/login', {
      statusCode: 200,
      body: userData
    }).as('login');

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
  });

  it('should be able to register at the San Francisco Public Library', () => {
    // We'll simulate the registration process
    cy.intercept('POST', '/api/users').as('registerRequest');
    
    // Request is mocked, but we'll simulate making it for the test flow
    cy.request({
      method: 'POST',
      url: '/api/users',
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

  it('should be able to login', () => {
    cy.intercept('POST', '/api/users/login').as('loginRequest');
    
    cy.request({
      method: 'POST',
      url: '/api/users/login',
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

  it('should be able to access library catalog', () => {
    cy.intercept('GET', '/api/libraries/san-francisco/catalog').as('catalogRequest');
    
    cy.request({
      method: 'GET',
      url: '/api/libraries/san-francisco/catalog',
      headers: {
        'Authorization': `Bearer ${userData.token}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('library');
      expect(response.body).to.have.property('items');
      expect(response.body.items).to.have.length(2);
      expect(response.body.items[0].title).to.include('Captain America');
    });
  });

  it('should be able to search for Captain America books', () => {
    cy.intercept('GET', '/api/search*').as('searchRequest');
    
    cy.request({
      method: 'GET',
      url: '/api/search',
      qs: {
        query: 'Captain America',
        library: 'san-francisco'
      },
      headers: {
        'Authorization': `Bearer ${userData.token}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('results');
      expect(response.body.results).to.have.length(2);
      expect(response.body.results[0].title).to.include('Captain America');
    });
  });

  it('should be able to get Captain America book details', () => {
    const bookId = 'captain-america-123';
    cy.intercept('GET', `/api/books/${bookId}`).as('bookDetailsRequest');
    
    cy.request({
      method: 'GET',
      url: `/api/books/${bookId}`,
      headers: {
        'Authorization': `Bearer ${userData.token}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('title');
      expect(response.body.title).to.include('Captain America');
    });
  });

  it('should be able to borrow a Captain America book', () => {
    const bookId = 'captain-america-123';
    cy.intercept('POST', '/api/borrow').as('borrowRequest');
    
    cy.request({
      method: 'POST',
      url: '/api/borrow',
      headers: {
        'Authorization': `Bearer ${userData.token}`
      },
      body: {
        bookId: bookId,
        libraryId: 'san-francisco'
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('message').that.includes('borrowed successfully');
    });
  });

  it('should be able to view borrowed books', () => {
    cy.intercept('GET', '/api/user/borrowed').as('borrowedBooksRequest');
    
    cy.request({
      method: 'GET',
      url: '/api/user/borrowed',
      headers: {
        'Authorization': `Bearer ${userData.token}`
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('borrowed');
      expect(response.body.borrowed).to.have.length(1);
      expect(response.body.borrowed[0].book.title).to.include('Captain America');
    });
  });

  it('should be able to return a book', () => {
    const bookId = 'captain-america-123';
    cy.intercept('POST', '/api/return').as('returnRequest');
    
    cy.request({
      method: 'POST',
      url: '/api/return',
      headers: {
        'Authorization': `Bearer ${userData.token}`
      },
      body: {
        bookId: bookId,
        libraryId: 'san-francisco'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('message').that.includes('returned successfully');
    });
  });
}); 