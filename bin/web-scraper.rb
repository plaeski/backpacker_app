require 'mechanize'
require 'csv'

travel_expenses = []
agent = Mechanize.new
page = agent.get('http://www.budgetyourtrip.com/countrylist.php')

country_links = page.links.find_all { |l| l.attributes.parent.parent.attributes["class"] &&  l.attributes.parent.parent.attributes["class"].value == 'placelist flow' }

(country_links.length).times do |i|
	country = country_links[i].click
	doc = country.parser 
	rows = doc.xpath('//table//tr')
	details = rows.collect do |row|
	  detail = {}
	  [
	    [:type, 'td/text()'],
	    [:currency, 'td/span[1]/text()'],
	    [:total, 'td/span[2]/text()'],
	  ].each do |name, xpath|
	    detail[name] = row.at_xpath(xpath).to_s
	  end
	  detail[:country_id] = i+1
	  travel_expenses.push(detail)
	end
end

column_names = travel_expenses.first.keys
s=CSV.generate do |csv|
  csv << column_names
  travel_expenses.each do |x|
    csv << x.values
  end
end
File.write('country_info.csv', s)