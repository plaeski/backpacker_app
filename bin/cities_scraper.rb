require 'mechanize'
require 'csv'

country_cities = []
agent = Mechanize.new
page = agent.get('http://www.budgetyourtrip.com/countrylist.php')

country_links = page.links.find_all { |l| l.attributes.parent.parent.attributes["class"] &&  l.attributes.parent.parent.attributes["class"].value == 'placelist flow' }

(country_links.length).times do |i|
	country = country_links[i].click
	budget = country.links.find{|l| l.attributes.text().include? "Cities and Regions"}
	if budget
		unless (budget.attributes["href"] && budget.attributes["href"].end_with?("#"))
			cities_page = budget.click
			doc = cities_page.parser
			unless doc.xpath('//a[@class="article-card article-card-medium"]').empty?
				cities = doc.xpath('//a[@class="article-card article-card-medium"]/span/span/text()')
			else
				cities = doc.xpath('//div[@class="city-block-wrapper"]/h3/a/text()')
			end
		else
			cities = country.xpath('//li[@class="budget "]/ul/li/a/text()')
		end
	end
	
	if cities
		details = cities.collect do |city|
		  detail = {}
		  [
		    [:name, city],
		  ].each do |name, value|
		    detail[name] = value.to_s
		    detail[:country_id] = i+1
		  end
		  country_cities.push(detail)
		end
	end
end

column_names = country_cities.first.keys
s=CSV.generate do |csv|
  csv << column_names
  country_cities.each do |x|
    csv << x.values
  end
end
File.write('country_cities.csv', s)