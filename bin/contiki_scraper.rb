require 'pry'
require 'mechanize'
require 'csv'

itineraries = []
agent = Mechanize.new
page = agent.get('https://www.contiki.com/destinations/new-zealand/tours?operational_region=3&page=2')

itinerary_links = page.links.find_all { |l| l.attributes.parent.attributes["class"] &&  l.attributes.parent.attributes["class"].value == 'search-result-item--trip' }

(itinerary_links.length).times do |i|
	trip = itinerary_links[i].click
	doc = trip.parser
	day_num = doc.xpath('//span[@class="daily-itinerary--excerpt-item daily-itinerary--day h h-caps vc"]//text()')
	cities = doc.xpath('//span[@class="daily-itinerary--excerpt-item daily-itinerary--leg-name h h-caps vc"]//text()') 
	countries = doc.xpath('//div[@class="tour-page--map l-inline-block-block"]//p/text()') || doc.xpath('//div[@class="tour-page--map l-inline-block-block"]//p/text()')
	details = {}
	city_list = cities.map do |city|
		city.to_s.gsub("\n", "").strip 
	end
	country_list = countries[1].to_s.gsub("\n", "").strip.split(",")
	details[:cities] = city_list
	details[:countries] = country_list
	# Hard Coded Continent
	details[:area] = "Australia/New Zealand"
	itineraries.push(details)
end

# To create initial File

# column_names = itineraries.first.keys
# s=CSV.generate do |csv|
#   csv << column_names
#   itineraries.each do |x|
#     csv << x.values
#   end
# end

# File.write('itineraries.csv', s)

CSV.open("itineraries.csv", "ab") do |csv|
	itineraries.each do |x|
    csv << x.values
  end
end
