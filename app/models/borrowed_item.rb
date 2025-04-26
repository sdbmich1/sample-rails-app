class BorrowedItem < ApplicationRecord
  belongs_to :library_item
  belongs_to :membership
end 