class CreateCountryExpenses < ActiveRecord::Migration
  def change
    create_table :country_expenses do |t|
    	t.string :expense_type
    	t.string :currency
    	t.float :total, precision: 7, scale: 2
    	t.references :country, index: true
      t.timestamps null: false
    end
  end
end