#!/bin/bash
set -e

# Debug environment variables
echo "Database connection details:"
echo "DATABASE_HOST: $DATABASE_HOST"
echo "DATABASE_USER: $DATABASE_USER"
echo "DATABASE_PASSWORD: $DATABASE_PASSWORD"

# Wait for PostgreSQL to start
echo "Waiting for PostgreSQL to start..."
until nc -z -v -w30 $DATABASE_HOST 5432
do
  echo "Waiting for PostgreSQL..."
  sleep 2
done
echo "PostgreSQL started..."

# Verify rack-cors is installed and available
echo "Verifying rack-cors gem installation..."
if ! gem list rack-cors -i > /dev/null 2>&1; then
  echo "Installing rack-cors gem..."
  gem install rack-cors
fi
echo "rack-cors gem is installed"

# Setup Rails environment
cd /app
echo "Setting up database..."
if [ -f /app/bin/rails ]; then
  bundle exec rake db:create db:migrate 2>/dev/null || echo "Database setup not needed"
fi

# Remove any existing server.pid file
rm -f /app/tmp/pids/server.pid

# Start Rails server
echo "Starting Rails server..."
exec "$@" 