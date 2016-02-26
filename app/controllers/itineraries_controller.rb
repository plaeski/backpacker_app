class ItinerariesController < ApplicationController

	def show
		@itineraries = Itinerary.where(area: params[:id])
	end

end
