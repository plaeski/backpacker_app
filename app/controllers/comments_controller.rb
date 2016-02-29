class CommentsController < ApplicationController

  # get the 10 latest comments only and format to json
  def index
    @comments = Comment.last(10)
    @comment = Comment.new
    # show comments from specific trip id
    # @trip = @comments.find_by(params[:trip_id])
    respond_to do |format|
      format.html
      format.json { render json: @comments.to_json }
    end
  end

  # create a new comment
  def create
    @comment = Comment.new(comment_params)
    @comment.trip = Trip.find(params[:trip_id])
    # only post comment to a specific trip
    # @trip_id = Trip.find_by(params[:id])
    @comment.save
    respond_to do |format|
      if @comment.save
        # flash[:notice] = "Comment was succesfully posted."
        # format.html { redirect_to trip_path({:id => 1}) }
        # redirect to trip path and only save the comment to specific trip_id
        format.html { redirect_to trip_path(@comment.trip_id) }

        format.json { render :show, status: :created, location: @comment }
      else
        # flash[:notice] = "Please try your post again."
        format.html { render :new }
        format.json { render json: @comment.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:content)
  end 

end