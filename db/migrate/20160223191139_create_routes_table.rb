class CreateRoutesTable < ActiveRecord::Migration
  def change
    create_table :routes do |t|
    	t.json				:route
    	t.references 	:trip, index: true
    	t.timestamps 	null: false
    end
  end
end
