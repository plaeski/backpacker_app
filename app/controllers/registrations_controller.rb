class RegistrationsController < Devise::RegistrationsController
  def new
  	super
  	if params[:id]
  		@trip_id = params[:id]
  	end
  end

  def create
    super
    if params[:trip_id]
    	user = @user.id
    	trip = params[:trip_id]
    	TripMembership.create(
    		user_id: user,
    		trip_id: trip
    		)
    end
  end
end
