// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Library data mocks
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

/**
 * Custom command to setup all library API mocks
 */
Cypress.Commands.add('setupLibraryMocks', () => {
  // Authentication endpoints
  cy.intercept('POST', '/api/users', {
    statusCode: 201,
    body: userData
  }).as('register');

  cy.intercept('POST', '/api/users/login', {
    statusCode: 200,
    body: userData
  }).as('login');

  // Library catalog endpoint
  cy.intercept('GET', '/api/libraries/san-francisco/catalog', {
    statusCode: 200,
    body: libraryData
  }).as('getLibraryCatalog');

  // Search endpoint
  cy.intercept('GET', '/api/search*', {
    statusCode: 200,
    body: searchResults
  }).as('searchBooks');

  // Book details endpoint
  cy.intercept('GET', '/api/books/captain-america-123', {
    statusCode: 200,
    body: bookDetails
  }).as('getBookDetails');

  // Borrow book endpoint
  cy.intercept('POST', '/api/borrow', {
    statusCode: 201,
    body: borrowResponse
  }).as('borrowBook');

  // Borrowed books endpoint
  cy.intercept('GET', '/api/user/borrowed', {
    statusCode: 200,
    body: borrowedBooks
  }).as('getBorrowedBooks');

  // Return book endpoint
  cy.intercept('POST', '/api/return', {
    statusCode: 200,
    body: returnResponse
  }).as('returnBook');
}); 