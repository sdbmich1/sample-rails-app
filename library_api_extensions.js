/**
 * Library API Extensions for Express Server
 * 
 * This file contains extensions for the Express server to handle library-related API endpoints
 * To use, copy these functions into your Express server or import this file
 */

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

// Add these routes to your Express app

function setupLibraryRoutes(app) {
  // Get library catalog
  app.get('/api/libraries/:libraryId/catalog', (req, res) => {
    const { libraryId } = req.params;
    const library = libraryDB.libraries.find(lib => lib.id === libraryId);
    
    if (!library) {
      return res.status(404).json({ errors: { library: ['not found'] } });
    }
    
    const items = libraryDB.books.filter(book => book.libraryId === libraryId);
    
    res.json({
      library,
      items
    });
  });

  // Search books
  app.get('/api/search', (req, res) => {
    const { query, library: libraryId } = req.query;
    
    if (!query) {
      return res.status(400).json({ errors: { query: ['is required'] } });
    }
    
    let results = libraryDB.books;
    
    // Filter by library if provided
    if (libraryId) {
      results = results.filter(book => book.libraryId === libraryId);
    }
    
    // Filter by search term
    results = results.filter(book => 
      book.title.toLowerCase().includes(query.toLowerCase()) || 
      book.author.toLowerCase().includes(query.toLowerCase())
    );
    
    res.json({
      query,
      libraryId,
      results
    });
  });

  // Get book details
  app.get('/api/books/:bookId', (req, res) => {
    const { bookId } = req.params;
    const book = libraryDB.books.find(b => b.id === bookId);
    
    if (!book) {
      return res.status(404).json({ errors: { book: ['not found'] } });
    }
    
    res.json(book);
  });

  // Borrow a book
  app.post('/api/borrow', (req, res) => {
    // Check if Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ errors: { authentication: ['required'] } });
    }
    
    const { bookId, libraryId } = req.body;
    
    if (!bookId || !libraryId) {
      return res.status(400).json({ errors: { fields: ['bookId and libraryId are required'] } });
    }
    
    const book = libraryDB.books.find(b => b.id === bookId && b.libraryId === libraryId);
    
    if (!book) {
      return res.status(404).json({ errors: { book: ['not found'] } });
    }
    
    if (!book.available) {
      return res.status(400).json({ errors: { book: ['not available'] } });
    }
    
    // Extract token and get user ID
    const token = authHeader.split(' ')[1];
    const userId = parseInt(token.split('_')[3]); // mock_jwt_token_for_user_ID_timestamp
    
    // Update book status
    book.available = false;
    
    // Add to borrowed books
    libraryDB.borrowedBooks.push({
      id: `borrow-${Date.now()}`,
      userId,
      bookId,
      libraryId,
      borrowedAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
    });
    
    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      dueDate: libraryDB.borrowedBooks[libraryDB.borrowedBooks.length - 1].dueDate
    });
  });

  // Get user's borrowed books
  app.get('/api/user/borrowed', (req, res) => {
    // Check if Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ errors: { authentication: ['required'] } });
    }
    
    // Extract token and get user ID
    const token = authHeader.split(' ')[1];
    const userId = parseInt(token.split('_')[3]); // mock_jwt_token_for_user_ID_timestamp
    
    // Get borrowed books for user
    const borrowed = libraryDB.borrowedBooks
      .filter(record => record.userId === userId)
      .map(record => {
        const book = libraryDB.books.find(b => b.id === record.bookId);
        return {
          ...record,
          book
        };
      });
    
    res.json({
      borrowed
    });
  });

  // Return a book
  app.post('/api/return', (req, res) => {
    // Check if Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ errors: { authentication: ['required'] } });
    }
    
    const { bookId, libraryId } = req.body;
    
    if (!bookId || !libraryId) {
      return res.status(400).json({ errors: { fields: ['bookId and libraryId are required'] } });
    }
    
    // Extract token and get user ID
    const token = authHeader.split(' ')[1];
    const userId = parseInt(token.split('_')[3]); // mock_jwt_token_for_user_ID_timestamp
    
    // Find borrow record
    const borrowIndex = libraryDB.borrowedBooks.findIndex(
      record => record.bookId === bookId && record.userId === userId
    );
    
    if (borrowIndex === -1) {
      return res.status(404).json({ errors: { borrow: ['record not found'] } });
    }
    
    // Remove borrow record
    libraryDB.borrowedBooks.splice(borrowIndex, 1);
    
    // Update book status
    const book = libraryDB.books.find(b => b.id === bookId);
    if (book) {
      book.available = true;
    }
    
    res.json({
      success: true,
      message: 'Book returned successfully'
    });
  });
}

// Export the setup function
module.exports = setupLibraryRoutes; 