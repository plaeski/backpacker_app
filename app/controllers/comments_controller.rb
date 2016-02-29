class CommentsController < ApplicationController

  # get the 10 latest comments only and format to json
  def index
    @comments = Comment.last(10)
    @comment = Comment.new
    respond_to do |format|
      format.html
      format.json { render json: @comments.to_json }
    end
  end

  # create a new comment
  def create
    @comment = Comment.new(comment_params)
    @comment.save
    respond_to do |format|
      if @comment.save
        # flash[:notice] = "Comment was succesfully posted."
        format.html { redirect_to action: "index" }
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