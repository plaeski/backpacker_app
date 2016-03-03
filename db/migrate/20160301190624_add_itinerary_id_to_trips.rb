class AddItineraryIdToTrips < ActiveRecord::Migration
  def change
  	add_reference :trips, :itinerary, index: true
  end
end
