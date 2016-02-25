class TripController < ApplicationController

  def show
  	@trip = Trip.find params[:id]
  	@route = @trip.trip_route.id
  	byebug
  end

end
