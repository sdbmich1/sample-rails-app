# frozen_string_literal: true

require 'faker'

# Library 1 members
Membership.all.destroy_all
User.destroy_all
user = User.create(first_name: 'Sean', last_name: 'Brown', password: 'setup#123', password_confirmation: 'setup#123',
                   email: 'sdbmich@yahoo.com')
# library = Library.second
member = Membership.create(user_id: user.id, card_no: '1234567890', library_id: library.id, status: 'active')

user2 = User.create(first_name: Faker::Name.first_name, last_name: Faker::Name.last_name,
                    password: 'setup#123', password_confirmation: 'setup#123', email: Faker::Internet.email)
member2 = Membership.create(user_id: user2.id, card_no: '2345678901', library_id: library.id, status: 'active')

# Library 2 members
# library2 = Library.first
user3 = User.create(first_name: Faker::Name.first_name, last_name: Faker::Name.last_name,
                    password: 'setup#123', password_confirmation: 'setup#123', email: Faker::Internet.email)

member3 = Membership.create(user_id: user3.id, card_no: '3456789012', library_id: library2.id, status: 'active')

user4 = User.create(first_name: Faker::Name.first_name, last_name: Faker::Name.last_name,
                    password: 'setup#123', password_confirmation: 'setup#123', email: Faker::Internet.email)
member4 = Membership.create(user_id: user4.id, card_no: '4567890123', library_id: library2.id, status: 'active')

# # Library 3 members
# library3 = Library.third
user5 = User.create(first_name: Faker::Name.first_name, last_name: Faker::Name.last_name,
                    password: 'setup#123', password_confirmation: 'setup#123', email: Faker::Internet.email)

member5 = Membership.create(user_id: user5.id, card_no: '5678901234', library_id: library3.id, status: 'active')

user6 = User.create(first_name: Faker::Name.first_name, last_name: Faker::Name.last_name,
                    password: 'setup#123', password_confirmation: 'setup#123', email: Faker::Internet.email)
member6 = Membership.create(user_id: user6.id, card_no: '6789012345', library_id: library3.id, status: 'active')

