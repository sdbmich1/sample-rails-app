#!/usr/bin/env node

/**
 * Script to add library API endpoints to the existing Express server
 * This script will make HTTP requests to add routes dynamically
 */

const http = require('http');

// In-memory database for testing
const libraryDB = {
  libraries: [
    {
      id: 'san-francisco',
      name: 'San Francisco Public Library',
      address: '100 Larkin St, San Francisco, CA 94102',
      phone: '(415) 557-4400'
    },
    {
      id: 'oakland',
      name: 'Oakland Public Library',
      address: '125 14th St, Oakland, CA 94612',
      phone: '(510) 238-3134'
    }
  ],
  books: [
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
    },
    {
      id: 'iron-man-789',
      title: 'Iron Man: Extremis',
      author: 'Warren Ellis',
      genre: 'Comics',
      available: true,
      libraryId: 'san-francisco',
      coverImage: 'https://example.com/iron-man.jpg'
    }
  ],
  borrowedBooks: []
};

// Make a request to add a route handler
function addHandler(method, path, responseData, statusCode = 200) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/_admin/addRoute',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`Added route ${method} ${path}: ${data}`);
        resolve(data);
      });
    });

    req.on('error', (error) => {
      console.error(`Error adding route ${method} ${path}: ${error.message}`);
      reject(error);
    });

    req.write(JSON.stringify({
      method,
      path,
      response: {
        status: statusCode,
        body: responseData
      }
    }));
    req.end();
  });
}

// Library catalog route
addHandler('GET', '/api/libraries/san-francisco/catalog', {
  library: libraryDB.libraries[0],
  items: libraryDB.books.filter(book => book.libraryId === 'san-francisco')
})
.then(() => {
  // Search books route
  return addHandler('GET', '/api/search', {
    query: 'Captain America',
    libraryId: 'san-francisco',
    results: libraryDB.books.filter(book => 
      book.title.toLowerCase().includes('captain america') && 
      book.libraryId === 'san-francisco'
    )
  });
})
.then(() => {
  // Book details route
  return addHandler('GET', '/api/books/captain-america-123', libraryDB.books[0]);
})
.then(() => {
  // Borrow book route
  return addHandler('POST', '/api/borrow', {
    success: true,
    message: 'Book borrowed successfully',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  }, 201);
})
.then(() => {
  // User's borrowed books route
  return addHandler('GET', '/api/user/borrowed', {
    borrowed: [{
      id: `borrow-${Date.now()}`,
      userId: 1,
      bookId: 'captain-america-123',
      libraryId: 'san-francisco',
      borrowedAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      book: libraryDB.books[0]
    }]
  });
})
.then(() => {
  // Return book route
  return addHandler('POST', '/api/return', {
    success: true,
    message: 'Book returned successfully'
  });
})
.then(() => {
  console.log('All library API endpoints have been added to the existing server!');
  console.log('You can now run your Cypress tests against these endpoints.');
})
.catch((error) => {
  console.error('Failed to add all routes:', error);
  console.error('Make sure the existing server at http://localhost:3001 is running and supports dynamic route addition.');
}); 