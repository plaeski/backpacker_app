class Trip < ActiveRecord::Base

	has_many :trip_members
	has_many :users, through: :trip_members

end
