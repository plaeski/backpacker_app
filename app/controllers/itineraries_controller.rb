class ItinerariesController < ApplicationController

	def show
		@area = params[:id].to_s
		@itineraries = Itinerary.where(area: @area)
		respond_to do |format|
      format.html 
      format.json { render json: @itineraries }
    end
	end

end
