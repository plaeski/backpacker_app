class Country < ActiveRecord::Base

	has_many :cities
	has_many :country_expenses

end
