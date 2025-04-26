class PingController < ApplicationController
  def index
    render json: { ping: "pong", timestamp: Time.now.to_i }
  end
end 