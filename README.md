# Library Management System

This Rails application implements a library management system with the following features:

## Models

- **Library**: Represents a library with name, address, and other attributes
- **LibraryItem**: Represents items stocked in a library's collection
- **Item**: Base items that can be added to libraries
- **BorrowedItem**: Tracks items borrowed by users
- **User**: User accounts with authentication
- **BcafSetting**: Application configuration settings

## Seed Data

The application includes seed data for development and testing:
- Library data with multiple locations
- Sample items of various types
- User accounts with different roles
- Borrowed item records

## Setup

1. Clone the repository
2. Run Docker containers: `docker-compose up -d`
3. Create the database: `docker exec -it dev-web-1 bash -c "cd /app && rails db:create"`
4. Run migrations: `docker exec -it dev-web-1 bash -c "cd /app && rails db:migrate"`
5. Seed the database: `docker exec -it dev-web-1 bash -c "cd /app && rails db:seed"`

## Development

The application runs in development mode with the following configurations:
- Auto-reloading of code changes
- Detailed error reporting
- SQL query logging
- Accessible via localhost and rails-api hosts 