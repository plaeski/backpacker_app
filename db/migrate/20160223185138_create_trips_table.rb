class CreateTripsTable < ActiveRecord::Migration
  def change
    create_table :trips do |t|
    	t.string			:name
    	t.timestamps null: false
    end
  end
end
