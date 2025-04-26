#!/usr/bin/env ruby
require 'net/http'
require 'uri'
require 'json'

# Set API URL - Using port 3003 for the bcaf_digital API container
API_URL = 'http://localhost:3003'

# Generate a random email for testing
random_string = ('a'..'z').to_a.sample(8).join
email = "test_#{random_string}@example.com"
password = "password123"
username = "test_user_#{random_string}"

# Helper function to make HTTP requests
def make_request(path, method, data = nil, headers = {})
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
  
  # Add any additional headers
  headers.each do |key, value|
    request[key] = value
  end
  
  puts "Making #{method.to_s.upcase} request to #{uri}"
  puts "Request body: #{data.to_json}" if data
  puts "Headers: #{headers}" if !headers.empty?
  
  response = http.request(request)
  puts "Response code: #{response.code}"
  puts "Response body: #{response.body}"
  
  return response
end

# Test 0: Health check
puts "=== TEST 0: Health check ==="
health_response = make_request('/health', :get)
if health_response.code == '200'
  puts "✅ Health check successful!"
else
  puts "❌ Health check failed!"
  exit 1
end

# Test 1: Register a new user
puts "\n=== TEST 1: Register a new user ==="
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
if register_response.code == '201' || register_response.code == '200'
  puts "✅ User registration successful!"
  user_data = JSON.parse(register_response.body)
  auth_token = user_data["token"] || user_data.dig("user", "authentication_token")
  if auth_token.nil?
    puts "❌ No authentication token found in response!"
    puts "Trying login endpoint..."
  else
    puts "✅ Authentication token received!"
  end
else
  puts "❌ User registration failed!"
  puts "Trying login endpoint..."
end

# Test 2: Login with the created user
puts "\n=== TEST 2: Login with created user ==="
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
  auth_token = login_data["token"] || login_data.dig("user", "authentication_token")
  if auth_token.nil?
    puts "❌ No authentication token found in login response!"
    exit 1
  else
    puts "✅ Authentication token received on login!"
  end
else
  puts "❌ Login failed!"
  puts "Trying older API endpoint format..."
  
  # Try the v1 endpoint format
  v1_login_data = {
    user: {
      email: email,
      password: password
    }
  }
  v1_login_response = make_request('/api/v1/login', :post, v1_login_data)
  if v1_login_response.code == '200'
    puts "✅ V1 Login successful!"
    v1_login_data = JSON.parse(v1_login_response.body)
    auth_token = v1_login_data["token"] || v1_login_data.dig("user", "authentication_token")
    if auth_token.nil?
      puts "❌ No authentication token found in V1 login response!"
      exit 1
    else
      puts "✅ Authentication token received on V1 login!"
    end
  else
    puts "❌ All login attempts failed!"
    exit 1
  end
end

# Test 3: Access protected route with token
puts "\n=== TEST 3: Access protected route with token ==="
# Try both token formats
auth_headers = {
  "Authorization" => "Token #{auth_token}",
  "X-User-Email" => email,
  "X-User-Token" => auth_token
}

response = make_request('/api/user', :get, nil, auth_headers)
if response.code == '200'
  puts "✅ Accessing protected route successful!"
else
  puts "❌ Accessing protected route failed with standard format!"
  
  # Try v1 endpoint
  v1_response = make_request('/api/v1/users/me', :get, nil, auth_headers)
  if v1_response.code == '200'
    puts "✅ Accessing V1 protected route successful!"
  else
    puts "❌ All protected route access attempts failed!"
    exit 1
  end
end

puts "\n✅ All tests completed!" 