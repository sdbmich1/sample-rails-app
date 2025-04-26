class Genre < ApplicationRecord
  has_many :genre_items, dependent: :destroy
end 