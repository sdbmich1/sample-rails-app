class Address < ApplicationRecord
  belongs_to :library, optional: true
end 