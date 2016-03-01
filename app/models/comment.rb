class Comment < ActiveRecord::Base

  belongs_to :user
  belongs_to :trip

  validates :content, presence: true

end