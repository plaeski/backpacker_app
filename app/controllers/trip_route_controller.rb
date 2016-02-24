class TripRouteController < ApplicationController
  def show
    @trip = params[:trip_id]
    @trip_route = params[:id]
    @route = TripRoute.find params[:id]

    respond_to do |format|
      format.html 
      format.json { render json: @route }
    end
  end

  def update
    respond_to do |format|
      format.json {
        @route = TripRoute.find params[:id]
        @new_route =params[:route_details]
        @route_array = @new_route.map do |position, details|
          details
        end
        @route.route_details = @route_array
        @route.save
        render json: @route
      }
    end
  end

end
