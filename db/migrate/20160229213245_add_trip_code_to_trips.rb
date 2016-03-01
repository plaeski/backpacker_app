class AddTripCodeToTrips < ActiveRecord::Migration
  def change
  	add_column :trips, :trip_code, :integer
  end
end
