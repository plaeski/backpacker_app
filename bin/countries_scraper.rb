require 'mechanize'
require 'csv'

countries = []
agent = Mechanize.new
page = agent.get('http://www.budgetyourtrip.com/countrylist.php')

country_list = page.search('//ul[@class="placelist flow"]/li/a/text()')

(country_list.length).times do |i|
  details = {}
  [
  	[:country, country_list[i]]
  ].each do |name, value|
    details[name] = value.to_s
  end
  details[:id] = i+1
  countries.push(details)
end

column_names = countries.first.keys

s=CSV.generate do |csv|
  csv << column_names
  countries.each do |x|
    csv << x.values
  end
end

File.write('countries.csv', s)