class GenreItem < ApplicationRecord
  belongs_to :genre
  belongs_to :item
end 