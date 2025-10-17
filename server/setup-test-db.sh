#!/bin/bash

echo "Setting up test database..."

# Set NODE_ENV to test
export NODE_ENV=test

# Create test database
echo "Creating database: book_tracker_test"
createdb book_tracker_test 2>/dev/null || echo "Database already exists"

# Run migrations
echo "Running migrations..."
npx sequelize-cli db:migrate

# Run seeders (optional - for test data)
echo "Running seeders..."
npx sequelize-cli db:seed:all

echo "Test database setup complete!"
echo "You can now run: npm test"
