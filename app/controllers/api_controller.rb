class ApiController < ActionController::API
  def ping
    render json: { pong: Time.now.to_i }
  end
  
  def health
    render json: { status: 'ok' }
  end
  
  def auth
    if params[:username] == 'test' && params[:password] == 'password'
      render json: { success: true, token: 'test_token' }
    else
      render json: { success: false }, status: :unauthorized
    end
  end
end 