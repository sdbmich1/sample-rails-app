Rails.application.routes.draw do
  # Health check
  get 'health', to: 'health#show'

  # API routes
  namespace :api do
    # Users and authentication
    post '/users', to: 'users#create'
    post '/users/login', to: 'users#login'
    get '/user', to: 'users#current'
    
    # Library management endpoints
    resources :libraries, only: [:index, :show, :create, :update, :destroy]
    resources :items, only: [:index, :show, :create, :update, :destroy]
    resources :library_items, only: [:index, :show, :create, :update, :destroy]
    resources :borrowed_items, only: [:index, :show, :create, :update, :destroy]
  end

  # Fallback to let the frontend handle routing
  get '*path', to: 'application#frontend_index_fallback'
end 