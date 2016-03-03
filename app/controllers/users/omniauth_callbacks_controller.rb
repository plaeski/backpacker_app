 class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
 
  def facebook
    @user = User.find_for_facebook_oauth(request.env["omniauth.auth"])
    params = request.env["omniauth.params"]
    if @user.persisted?
      if params.empty? == false 
        TripMembership.create(
          trip_id: params["trip_id"].to_i,
          user_id: @user.id
        )
      end
      sign_in_and_redirect(@user, :event => :authentication) #this will throw if @user is not activated
    else
      session["devise.facebook_data"] = request.env["omniauth.auth"]
      redirect_to new_user_registration_path
      set_flash_message(:notice, :email_exists)
   end
 end

 def twitter
   @user = User.find_for_twitter_oauth(request.env["omniauth.auth"])
   if @user.persisted?
      if params.empty? == false 
        TripMembership.create(
          trip_id: params["trip_id"].to_i,
          user_id: @user.id
        )
      end
     sign_in_and_redirect @user, :event => :authentication #this will throw if @user is not activated
   else
     session["devise.twitter_data"] = request.env["omniauth.auth"].select { |k, v| k == "email" }
     redirect_to new_user_registration_path
   end
 end

 def failure
   redirect_to root_path
 end

end