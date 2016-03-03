Rails.application.routes.draw do

  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks", 
    :registrations => "registrations" }
  devise_scope :user do
    get '/trip_preview/join/:id', :as=> 'trip_preview_join', :to => 'registrations#new'
  end
  
  get 'info_map/index'

  root to: 'visitors#index'
 
  authenticated :user do
    root 'user#show', as: :authenticated_root
  end

  resources :users, except: :index
  match '/users/:id/finish_signup' => 'users#finish_signup', via: [:get, :patch], :as => :finish_signup
  resources :trip, except: [:index, :edit] do
  	resources :trip_route, only: [:show]
    resources :comments, only: [:create]
    resources :itineraries, only:[:show]
  end
  
  resources :trip_preview, only: [:show]
  match '/trip_route/update', to: 'trip_route#update', via: [:post], constraints: { format: 'json' }
  match '/trip_route/stop/delete', to: 'trip_route#edit', via: [:post], constraints: { format: 'json' }
  match '/trip/:id', to: 'trip#update', via: [:patch], constraints: { format: 'json' }
  resources :comments
  resources :info_map, only: [:index]

  resource :budgets
  post '/budgets/compute' => 'budgets#compute'

end
 
