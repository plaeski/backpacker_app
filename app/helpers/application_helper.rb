# require 'money'
# require 'money/bank/google_currency'
# require 'monetize'

module ApplicationHelper

  # def country_info (country_name)
  #   current_id = get_country_id(country_name)
  #   country_currency_code = get_currency_code(country_name)

  #   info_arr = get_all_info_from_country(current_id)
  #   local_cost_arr = get_local_expenses(info_arr)  # local_cost_arr = [ Daily Cost, Accommodation, Food, Local Transportation, Alcohol ]
    
  #   canada_currency = convert_currency(country_currency_code)
  #   canadian_money_arr = calculate_expense_in_CAD(local_cost_arr, canada_currency)
  #   percent_arr = calculate_percents(canadian_money_arr)
    
  #   [country_name, current_id, country_currency_code, local_cost_arr, canada_currency, canadian_money_arr, percent_arr]
  # end

  # def set_base_currency
  #   Money::Bank::GoogleCurrency.ttl_in_seconds = 86400
  #   Money.default_bank = Money::Bank::GoogleCurrency.new
  #   Money.new(1_00, "CAD")  # amount is in cents
  # end

  # def get_country_id (country_name)
  #   Country.where(:country => country_name)[0].id
  # end

  # def get_currency_code (country_name)
  #   Country.where(:country => country_name)[0].currency
  # end

  # def get_country_name_by_id (id)
  #   Country.find(id).country
  # end

  # def get_all_info_from_country (current_id)
  #   # returns array with same country_id
  #   CountryExpense.all.select{ |x| x.country_id == current_id }
  # end

  # def get_local_expenses (info_array)
  #   i = 0
  #   result = []
  #   while i < info_array.length
  #     if info_array[i].expense_type == "Daily Cost"
  #       result[0] = info_array[i].total
  #     elsif info_array[i].expense_type == "Accommodation"
  #       result[1] = info_array[i].total
  #     elsif info_array[i].expense_type == "Food"
  #       result[2] = info_array[i].total
  #     elsif info_array[i].expense_type == "Local Transportation"
  #       result[3] = info_array[i].total
  #     elsif info_array[i].expense_type == "Alcohol"
  #       result[4] = info_array[i].total
  #     end
  #     i += 1
  #   end
  #   result
  # end

  # # this method takes some times!
  # def convert_currency (country_currency_code)
  #   current = set_base_currency  # amount is in cents
  #   if country_currency_code == "XCD"
  #     result = 2.0
  #   elsif country_currency_code == "ECS"
  #     result = 18936.5
  #   elsif country_currency_code == "MGF"
  #     result = 2391.92
  #   else
  #     result = current.exchange_to(country_currency_code.to_sym).to_f
  #   end
  #   result
  # end

  # def calculate_expense_in_CAD (local_expense_arr, canada_currency)
  #   results = []
  #   local_expense_arr.each do |value|
  #     results.push((value/canada_currency).round(2))
  #   end
  #   results
  # end

  # def calculate_percents (money_arr)
  #   results = []
  #   sum = money_arr[1] + money_arr[2] + money_arr[3] + money_arr[4]
  #   accommo_p = ((money_arr[1]/sum)*100).round(2)
  #   food_p = ((money_arr[2]/sum)*100).round(2)
  #   local_transit_p = ((money_arr[3]/sum)*100).round(2)
  #   alcohol_p = ((money_arr[4]/sum)*100).round(2)
  #   should_be_hundred_ish = accommo_p+food_p+local_transit_p+alcohol_p
  #   results = [accommo_p, food_p, local_transit_p, alcohol_p, should_be_hundred_ish]
  # end

  # def calculate_expected_budget (days, country_name)
  #   daily_cost = country_info(country_name)[5][0]
  #   (days * daily_cost).round(2)
  # end

  # def calculate_expected_trip_days (budget, country_name)
  #   daily_cost = country_info(country_name)[5][0]
  #   range = (budget / daily_cost).round(0)
  #   [range - 1, range + 1]
  # end

  # def show_country_suggestion (days, budget)
  #   max_budget = (budget + 10).to_f
  #   min_budget = (budget - 10).to_f
  #   # my_daily_cost = (budget.to_f / days).round(4)
  #   max_cost = (max_budget / days).round(2)
  #   min_cost = (min_budget / days).round(2)
  #   min_cost = 0 if min_cost < 0
  #   # [ min_cost, max_cost ]

  #   extracted_local_info = CountryExpense.all.where(:expense_type => "Daily Cost").map { |info| [info.total, info.country_id] }

  #   num = extracted_local_info.map { |x| x[1] }
  #   local_expense_arr = extracted_local_info.map { |x| x[0] }
  #   all_currency_code = num.map { |y| Country.find(y).currency }
  #   all_currency = all_currency_code.map { |z| convert_currency(z) } # this takes time
    
  #   i = 0
  #   result = []
  #   while i < num.length
  #     a = (local_expense_arr[i]/all_currency[i]).round(2)
  #     if a >= min_cost && a <= max_cost
  #       result.push([a, i])
  #     end
  #     i += 1
  #   end
  #   # result  # =  [ [ , ], [ , ], [ , ], ...... ]
    
  #   filtered_country = []
  #   result.map do |info|
  #     a = get_country_name_by_id(info[1])
  #     filtered_country.push(a)
  #   end
  #   filtered_country
  # end

end