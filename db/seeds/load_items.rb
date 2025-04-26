# frozen_string_literal: true

require 'faker'

# load items
Rake::Task['load_data:load_all'].execute

# load library items
Library.all.each do |library|
  Item.find_each do |item|
    LibraryItem.create(library_id: library.id, item_id: item.id, status: 'active', isbn: SecureRandom.uuid,
                       language: 'English', amount: 0.99)
  end
end

# load featured items
image1 = 'https://bcaf-comic-streaming-titles.s3-us-west-1.amazonaws.com/bcaf-digital-images/Accell%2B003-000-titleImg.jpg'
image2 = 'https://bcaf-comic-streaming-titles.s3-us-west-1.amazonaws.com/bcaf-digital-images/Captain%2BAmerica%2B-%2BSam%2BWilson%2B010-titleImg.jpg'
image3 = 'https://bcaf-comic-streaming-titles.s3-us-west-1.amazonaws.com/bcaf-digital-images/Captain%2BMarvel%2B(2016)%2B010-000-titleImg.jpg'

# item = Item.find_by(name: 'Accell', issue_no: '3')
item = Item.where("title like '%Avenger%'").first
item2 = Item.where("title like '%Sam Wilson%'").first
item3 = Item.where("title like '%Captain Marvel%'").first
puts "Loading images for Item: #{item.title}"
Library.all.each do |library|
  li = LibraryItem.find_by(library_id: library.id, item_id: item.id)
  li.featured_items.create!(image_url: image1)
end

puts "Loading images for Item: #{item2.title}"
Library.all.each do |library|
  li = LibraryItem.find_by(library_id: library.id, item_id: item2.id)
  li.featured_items.create!(image_url: image2)
end

puts "Loading images for Item: #{item3.title}"
Library.all.each do |library|
  li = LibraryItem.find_by(library_id: library.id, item_id: item3.id)
  li.featured_items.create!(image_url: image3)
end
