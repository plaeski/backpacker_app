require 'faker'
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
user = CreateAdminService.new.call
puts 'CREATED ADMIN USER: ' << user.email

include Superseeder
seed :countries
seed :cities
seed :country_expenses


##########################################
##  Change this numbers to generate things as much as you want

NUMBER_OF_COMMENTS = 11

##########################################

# # Create comments
NUMBER_OF_COMMENTS.times do
  Comment.create!(
    content: Faker::Lorem.sentence,
    user_id: Faker::Number.between(1, NUMBER_OF_COMMENTS)
  )
end