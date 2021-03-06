class TripController < ApplicationController

  def show
  	@trip = Trip.find params[:id]
    # show last 10 most recent comments in the trip
    @comments = Comment.where(trip: @trip)
  	@route = @trip.trip_route.id
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
  		redirect_to trip_path(@trip.id)
		else
			flash[:failure] = "Please enter a name!"
		end
	end

  def update
    respond_to do |format|
      format.json {
        @trip = Trip.find params[:id]
        @trip.itinerary_id = params[:trip_id]
        if @trip.save
          data = {}
          data["redirect"] = "/trip/#{@trip.id}"
          render json: data
        end
      }
    end
  end
end
