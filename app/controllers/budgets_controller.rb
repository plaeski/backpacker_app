class BudgetsController < ApplicationController

  def show
    @countries = Country.all
    @expenses = CountryExpense.all
  end

  def compute

    option = params[:option].to_i

    if option == 1
      my_country_id = params[:country].to_i
      my_budget = params[:budget].to_i
      
      country_name = Calculator.get_country_name_by_id(my_country_id)
      result = Calculator.calculate_expected_trip_days(my_budget,country_name)
      my_data = Calculator.country_info(country_name)
      percent = my_data[6]

      all = Calculator.get_all_info_from_country(my_country_id)
      canada_currency = Calculator.convert_currency(my_data[2])

      fun_info = []

      all.each do |item|
        converted_money = (item.total/canada_currency).round(2)
        fun_info.push([item.expense_type, converted_money])
      end

      render json: { country_name: country_name.to_json, percent: percent.to_json, result: result.to_json, fun_info: fun_info.to_json }


    elsif option == 2
      my_country_id = params[:country].to_i
      my_days = params[:days].to_i

      country_name = Calculator.get_country_name_by_id(my_country_id)
      result = Calculator.calculate_expected_budget(my_days, country_name)
      my_data = Calculator.country_info(country_name)
      percent = Calculator.country_info(country_name)[6]

      all = Calculator.get_all_info_from_country(my_country_id)
      canada_currency = Calculator.convert_currency(my_data[2])

      fun_info = []

      all.each do |item|
        converted_money = (item.total/canada_currency).round(2)
        fun_info.push([item.expense_type, converted_money])
      end

      render json: { country_name: country_name.to_json, percent: percent.to_json, result: result.to_json, fun_info: fun_info.to_json }

    # elsif option == 3
    #   my_budget = params[:budget].to_i
    #   my_days = params[:days].to_i

    #   result = Calculator.show_country_suggestion(my_days, my_budget)

    #   render json: { result: result.to_json }
    end

  end

end
