class TestController < ActionController::API
  def index
    render json: { status: "ok", message: "Express to Rails connection successful!" }
  end
end 