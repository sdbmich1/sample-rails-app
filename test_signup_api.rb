#!/usr/bin/env ruby
require 'net/http'
require 'uri'
require 'json'

# Set API URL - Using port 3001 for the express server
API_URL = 'http://localhost:3001'

# Generate a random email for testing
random_string = ('a'..'z').to_a.sample(8).join
email = "test_#{random_string}@example.com"
password = "password123"
username = "test_user_#{random_string}"

puts "=== Testing Signup Process with Express API Server ==="
puts "Using test credentials:"
puts "Email: #{email}"
puts "Username: #{username}"

# Helper function to make HTTP requests
def make_request(path, method, data = nil)
  uri = URI.parse("#{API_URL}#{path}")
  http = Net::HTTP.new(uri.host, uri.port)
  
  case method
  when :get
    request = Net::HTTP::Get.new(uri.request_uri)
  when :post
    request = Net::HTTP::Post.new(uri.request_uri)
    request.body = data.to_json if data
    request["Content-Type"] = "application/json"
  end
  
  puts "\nMaking #{method.to_s.upcase} request to #{uri}"
  puts "Request body: #{data.to_json}" if data
  
  response = http.request(request)
  puts "Response code: #{response.code}"
  puts "Response body: #{response.body}"
  
  return response
end

# Test 1: Check API Health
puts "\n=== TEST 1: Check API Health ==="
health_response = make_request('/health', :get)
if health_response.code == '200'
  puts "✅ API Health check successful!"
else
  puts "❌ API Health check failed!"
  exit 1
end

# Test 2: Register a new user
puts "\n=== TEST 2: Register a new user ==="
register_data = {
  user: {
    name: "Test User",
    username: username,
    email: email,
    password: password,
    password_confirmation: password
  }
}

register_response = make_request('/api/users', :post, register_data)
if register_response.code == '201'
  puts "✅ User registration successful!"
  user_data = JSON.parse(register_response.body)
  auth_token = user_data["token"]
else
  puts "❌ User registration failed!"
  exit 1
end

# Test 3: Login with the created user
puts "\n=== TEST 3: Login with created user ==="
login_data = {
  user: {
    email: email,
    password: password
  }
}

login_response = make_request('/api/users/login', :post, login_data)
if login_response.code == '200'
  puts "✅ Login successful!"
  login_data = JSON.parse(login_response.body)
  auth_token = login_data["token"]
else
  puts "❌ Login failed!"
  exit 1
end

# Test 4: Access protected route with token
puts "\n=== TEST 4: Access protected route with token ==="
uri = URI.parse("#{API_URL}/api/user")
http = Net::HTTP.new(uri.host, uri.port)
request = Net::HTTP::Get.new(uri.request_uri)
request["Authorization"] = "Bearer #{auth_token}"

puts "Making GET request to #{uri} with Authorization header"
response = http.request(request)
puts "Response code: #{response.code}"
puts "Response body: #{response.body}"

if response.code == '200'
  puts "✅ Accessing protected route successful!"
else
  puts "❌ Accessing protected route failed!"
  exit 1
end

puts "\n✅ All signup tests passed successfully!"
