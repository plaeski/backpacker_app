class TripController < ApplicationController

  def show
  	@trip = Trip.find params[:id]
  	@route = @trip.trip_route.id
    byebug
  end

  def new
  	@trip = Trip.new
	end

	def create
    prng = Random.new
		@trip = Trip.new(
      name: params[:trip]["name"],
      trip_code: prng.rand(100000...1000000)
    )
		if @trip.save

  		TripMembership.create(user_id: current_user.id, trip_id: @trip.id)
  		TripRoute.create(trip_id: @trip.id)
  		flash[:success] = "Trip created successfully!"
  		redirect_to trip_path(@trip.id)
		else
			flash[:failure] = "Please enter a name!"
		end
	end
end
