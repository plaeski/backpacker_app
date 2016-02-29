class CountryExpensesController < ActionController::Base
  def index
  	@countries = Country.all
  	@expenses = CountryExpense.all
  	@country_expenses = []
  	@countries.each do |country|
  	  food = country.country_expenses.where(expense_type:"Food")
  	  daily_cost = country.country_expenses.where(expense_type:"Daily Cost")
  	  local_transportation = country.country_expenses.where(expense_type:"Food")
  	  accomodation = country.country_expenses.where(expense_type:"Accommodation")
	  	ce = Hash.new
  	 	ce[:name] = country.country
  	 	ce[:currency] = food[0].currency
  	 	ce[:daily_cost] = daily_cost[0].total
  	 	ce[:accomodation] = accomodation[0].total
  	 	ce[:food] = food[0].total
  	 	ce[:local_transportation] = local_transportation[0].total
  	 	@country_expenses.push(ce) 
  	end
  	if @countries.empty?
      render json: @country_expenses.to_json
    else
      render json: @country_expenses.to_json
    end
  end

   def show
    @item = Item.where(params[:id])

    if @item.empty?
      render json: { message: "Item number #{params[:id]} does not exist", status: :not_found }
    else
      render json: @item.to_json
    end
  end
end
  
end
