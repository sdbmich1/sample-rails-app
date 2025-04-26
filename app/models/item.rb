class Item < ApplicationRecord
  has_many :library_items, dependent: :destroy
  has_many :genre_items, dependent: :destroy
end 