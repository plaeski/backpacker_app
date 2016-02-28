class CreateTripRoutesTable < ActiveRecord::Migration
  def change
    create_table :trip_routes do |t|
    	t.json				:route_details
    	t.references 	:trip, index: true
    	t.timestamps 	null: false
    end
  end
end
