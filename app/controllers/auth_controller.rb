class AuthController < ApplicationController
  def login
    # This is a simplified auth endpoint for testing
    if params[:username] == "test" && params[:password] == "password"
      render json: { 
        success: true, 
        token: "test_token_123", 
        user: { 
          id: 1, 
          username: "test", 
          role: "user" 
        } 
      }
    else
      render json: { success: false, message: "Invalid credentials" }, status: :unauthorized
    end
  end

  def verify
    # Simple verification endpoint
    if request.headers["Authorization"] == "Bearer test_token_123"
      render json: { valid: true, user: { id: 1, username: "test", role: "user" } }
    else
      render json: { valid: false, message: "Invalid token" }, status: :unauthorized
    end
  end
end 