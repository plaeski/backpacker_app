class TripPreviewController < ApplicationController

	def show
		@trip = Trip.find_by(trip_code:params[:id])
	end	

end