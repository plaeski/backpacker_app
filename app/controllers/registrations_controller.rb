class RegistrationsController < Devise::RegistrationsController
  def new
  	super
  	if params[:id]
  		@trip_code = params[:id]
  	end
  end

  def create
    super
    if params[:user][:name]
      @user.name = params[:user][:name]
      @user.save
    end
    if params[:trip_id]
    	user = @user.id
    	trip = Trip.find_by(trip_code: params[:trip_id])
    	TripMembership.create(
    		user_id: user,
    		trip_id: trip.id
    		)
    end
  end
end
