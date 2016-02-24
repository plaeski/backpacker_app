class Trip < ActiveRecord::Base

	has_many :trip_memberships
	has_many :users, through: :trip_memberships
	has_one :trip_route

end
