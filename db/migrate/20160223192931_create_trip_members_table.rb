class CreateTripMembersTable < ActiveRecord::Migration
  def change
    create_table :trip_memberships do |t|
    	t.references 	:user, index: true
    	t.references 	:trip, index: true
    	t.timestamps null: false
    end
  end
end
