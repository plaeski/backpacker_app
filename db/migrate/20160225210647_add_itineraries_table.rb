class AddItinerariesTable < ActiveRecord::Migration
  def change
  	create_table :itineraries do |t|
    	t.text :cities, array: true, default: []
    	t.text :countries, array: true, default: []
    	t.string :area
    	t.timestamps 	null: false
    end
  end
end
