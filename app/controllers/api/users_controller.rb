class Api::UsersController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user, only: [:current]

  # POST /api/users
  def create
    @user = User.new(user_params)
    
    if @user.save
      # Generate JWT token
      token = generate_jwt_token(@user)
      
      render json: { user: user_response(@user), token: token }, status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # POST /api/users/login
  def login
    @user = User.find_by(email: params[:user][:email])
    
    if @user && @user.authenticate(params[:user][:password])
      # Generate JWT token
      token = generate_jwt_token(@user)
      
      render json: { user: user_response(@user), token: token }
    else
      render json: { errors: ['Invalid email or password'] }, status: :unauthorized
    end
  end

  # GET /api/user
  def current
    render json: { user: user_response(@current_user) }
  end

  private

  def user_params
    params.require(:user).permit(:name, :username, :email, :password, :password_confirmation)
  end

  def user_response(user)
    {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  end

  def generate_jwt_token(user)
    payload = {
      user_id: user.id,
      exp: 24.hours.from_now.to_i
    }
    
    JWT.encode(payload, Rails.application.secrets.secret_key_base, 'HS256')
  end

  def authenticate_user
    auth_header = request.headers['Authorization']
    
    if auth_header
      token = auth_header.split(' ').last
      begin
        decoded_token = JWT.decode(token, Rails.application.secrets.secret_key_base, true, algorithm: 'HS256')
        user_id = decoded_token.first['user_id']
        @current_user = User.find_by(id: user_id)
      rescue JWT::DecodeError
        render json: { errors: ['Invalid token'] }, status: :unauthorized
      rescue JWT::ExpiredSignature
        render json: { errors: ['Token has expired'] }, status: :unauthorized
      end
    else
      render json: { errors: ['Authorization token required'] }, status: :unauthorized
    end
  end
end 