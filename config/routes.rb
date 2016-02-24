Rails.application.routes.draw do
  root to: 'visitors#index'
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  resources :users
  get '/map_planner' => 'map_planner#index'
  match '/users/:id/finish_signup' => 'users#finish_signup', via: [:get, :patch], :as => :finish_signup
  # resources :country_expenses, :defaults => { :format => :json }
  resources :trip, except: :index do
  	resources :trip_route, only: [:show]
  end
  match '/trip_route/update', to: 'trip_route#update', via: [:post], constraints: { format: 'json' }
  match '/trip_route/stop/delete', to: 'trip_route#edit', via: [:post], constraints: { format: 'json' }
  # post '/trip_route/update' => 'trip_route#update', :defaults => { :format => :json },
  # post '/trip_route/stop/delete' => 'trip_route#edit', :defaults => { :format => :json }
end
