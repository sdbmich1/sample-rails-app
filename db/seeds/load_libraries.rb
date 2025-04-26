# frozen_string_literal: true

require 'faker'

# load 'db/seeds/load_bcaf_settings.rb'

Library.destroy_all
LibraryCard.destroy_all
img1 = 'https://bcaf-comic-streaming-titles.s3-us-west-1.amazonaws.com/bcaf-digital-images/San_Francisco_Public_Library_Main_Branch_looking_up-1800.jpg'
img2 = 'https://bcaf-comic-streaming-titles.s3-us-west-1.amazonaws.com/bcaf-digital-images/The_Main_Library%2C_San_Francisco%2C_California_LCCN2013630232-1800.jpg'
img3 = 'https://bcaf-comic-streaming-titles.s3-us-west-1.amazonaws.com/bcaf-digital-images/sfpl_logo-hi-res.png'

library = Library.create(name: 'San Francisco Public Library', email: 'admin@sfpl.org',
                         url: 'http://sfpl.libanswers.com/faq/65116', domain: 'sfpl',
                         access_token: SecureRandom.uuid, access_key: SecureRandom.base64,
                         select_image_url: img1,
                         login_image_url: img2, logo_url: img3,
                         access_url: 'api/v1/library_cards')
library.build_library_setting(max_item_quantity: 1, max_borrow_quantity: 3, borrow_days: 21)
library.addresses.create(street: '100 Larkin Street', city: 'San Francisco', state: 'CA', zip: '94101')
library2 = Library.create(name: 'Los Angeles Public Library', email: 'admin@lapl.org',
                          url: 'http://www.lapl.org/about-lapl/borrower-services', domain: 'lapl',
                          access_token: SecureRandom.uuid, access_key: SecureRandom.base64,
                          access_url: 'api/v1/library_cards')
library2.build_library_setting(max_item_quantity: 1, max_borrow_quantity: 3, borrow_days: 21)
library2.addresses.create(street: '100 Union Street', city: 'Los Angeles', state: 'CA', zip: '90019')
library3 = Library.create(name: 'Atlanta Public Library', email: 'admin@afpls.org', domain: 'apl',
                          url: 'http://afpls.org/afplsservices/library-cards',
                          access_token: SecureRandom.uuid, access_key: SecureRandom.base64,
                          access_url: 'api/v1/library_cards')
library3.addresses.create(street: '100 Peachtree Ave', city: 'Atlanta', state: 'GA', zip: '30033')
library3.build_library_setting(max_item_quantity: 1, max_borrow_quantity: 3, borrow_days: 21)
LibraryCard.create(library_key: library.access_key, card_id: '1234567890', library_name: library.name,
                   access_token: SecureRandom.uuid, member_name: Faker::Name.name)
LibraryCard.create(library_key: library.access_key, card_id: '2345678901', library_name: library.name,
                   access_token: SecureRandom.uuid, member_name: Faker::Name.name)
LibraryCard.create(library_key: library2.access_key, card_id: '3456789012', library_name: library2.name,
                   access_token: SecureRandom.uuid, member_name: Faker::Name.name)
LibraryCard.create(library_key: library2.access_key, card_id: '4567890123', library_name: library2.name,
                   access_token: SecureRandom.uuid, member_name: Faker::Name.name)
LibraryCard.create(library_key: library3.access_key, card_id: '5678901234', library_name: library3.name,
                   access_token: SecureRandom.uuid, member_name: Faker::Name.name)
LibraryCard.create(library_key: library3.access_key, card_id: '6789012345', library_name: library3.name,
                   access_token: SecureRandom.uuid, member_name: Faker::Name.name)
