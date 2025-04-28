/**
 * Enhanced Express Server with Library API Extensions
 * 
 * This server extends the original Express server with library API endpoints
 * for testing the library borrowing process.
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const setupLibraryRoutes = require('./library_api_extensions');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Static files
app.use(express.static('src'));

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    authentication: 'mock enabled'
  });
});

// Mock user database
const mockUsers = [];
let nextUserId = 1;

// User registration endpoint
app.post('/api/users', (req, res) => {
  const { user } = req.body;
  
  if (!user || !user.email || !user.password) {
    return res.status(422).json({
      errors: {
        body: ['email and password are required']
      }
    });
  }
  
  // Check if user exists
  const existingUser = mockUsers.find(u => u.email === user.email);
  if (existingUser) {
    return res.status(422).json({
      errors: {
        email: ['has already been taken']
      }
    });
  }
  
  // Create new user
  const newUser = {
    id: nextUserId++,
    email: user.email,
    username: user.username || `user_${Date.now()}`,
    name: user.name || 'User',
    library: user.library || 'San Francisco Public Library',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockUsers.push({
    ...newUser,
    password: user.password
  });
  
  // Generate token
  const token = `mock_jwt_token_for_user_${newUser.id}_${Date.now()}`;
  
  res.status(201).json({
    user: newUser,
    token
  });
});

// User login endpoint
app.post('/api/users/login', (req, res) => {
  const { user } = req.body;
  
  if (!user || !user.email || !user.password) {
    return res.status(422).json({
      errors: {
        body: ['email and password are required']
      }
    });
  }
  
  // Find user
  const existingUser = mockUsers.find(u => u.email === user.email && u.password === user.password);
  if (!existingUser) {
    return res.status(401).json({
      errors: {
        'email or password': ['is invalid']
      }
    });
  }
  
  // Generate token
  const token = `mock_jwt_token_for_user_${existingUser.id}_${Date.now()}`;
  
  res.json({
    user: {
      id: existingUser.id,
      email: existingUser.email,
      username: existingUser.username,
      name: existingUser.name,
      created_at: existingUser.created_at,
      updated_at: existingUser.updated_at
    },
    token
  });
});

// Legacy login endpoint for v1 API
app.post('/api/v1/login', (req, res) => {
  // Redirect to new login endpoint
  return res.redirect(307, '/api/users/login');
});

// Current user endpoint
app.get('/api/user', (req, res) => {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      errors: {
        authentication: ['required']
      }
    });
  }
  
  // In a real app, we would verify the token
  // For mock purposes, we'll just return a default user
  res.json({
    user: {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      created_at: '2025-01-01T00:00:00.000Z',
      updated_at: '2025-01-01T00:00:00.000Z'
    }
  });
});

// Set up library routes
setupLibraryRoutes(app);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    errors: {
      body: ['Not found']
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Enhanced server with library endpoints running at http://localhost:${PORT}`);
  console.log(`Serving static files from: ${__dirname}/src`);
  console.log('Mock authentication API enabled for testing');
  console.log('Library API endpoints enabled for testing borrowing flow');
}); 