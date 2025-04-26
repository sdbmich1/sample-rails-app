# frozen_string_literal: true

require 'faker'

# Item Categories
Category.all.destroy_all

Library.all.each do |library|
  Category.new(library_id: library.id, name: 'Single Issue Comic', code: 'SIC', amount: 1.00, item_type_code: 'CO')
  Category.new(library_id: library.id, name: 'Graphic Novel', code: 'GN', amount: 1.25, item_type_code: 'GN')
  Category.new(library_id: library.id, name: 'Trade Paperback', code: 'TP', amount: 1.25, item_type_code: 'TP')
  Category.new(library_id: library.id, name: 'Manga', code: 'MG', amount: 1.25, item_type_code: 'MG')
  Category.new(library_id: library.id,  name: 'Other', code: 'OT', amount: 1.50, item_type_code: 'OT')
end
