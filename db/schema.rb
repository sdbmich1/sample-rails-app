# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2024_08_30_012533) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"

  create_table "active_storage_attachments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.uuid "record_id", null: false
    t.uuid "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.uuid "active_storage_blobs_id"
    t.index ["active_storage_blobs_id"], name: "index_active_storage_variant_records_on_active_storage_blobs_id"
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "addresses", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "street"
    t.string "street2"
    t.string "city"
    t.string "state"
    t.string "zip"
    t.string "addressable_type", null: false
    t.uuid "addressable_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "home_phone"
    t.string "work_phone"
    t.string "mobile_phone"
    t.string "address_type"
    t.string "country"
    t.index ["addressable_type", "addressable_id"], name: "index_addresses_on_addressable"
  end

  create_table "bcaf_settings", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "logo_url"
    t.string "image_url"
    t.string "slogan"
    t.string "tagline"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "selection_image_url"
  end

  create_table "borrowed_items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "quantity"
    t.float "amount"
    t.datetime "due_date"
    t.uuid "library_item_id"
    t.uuid "membership_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "status"
    t.index ["library_item_id"], name: "index_borrowed_items_on_library_item_id"
    t.index ["membership_id"], name: "index_borrowed_items_on_membership_id"
    t.index ["status"], name: "index_borrowed_items_on_status"
  end

  create_table "categories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "library_id", null: false
    t.string "code"
    t.string "name"
    t.string "item_type_code"
    t.float "amount"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["library_id"], name: "index_categories_on_library_id"
  end

  create_table "favorite_items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "membership_id"
    t.uuid "library_item_id"
    t.string "status", default: "active", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["library_item_id"], name: "index_favorite_items_on_library_item_id"
    t.index ["membership_id"], name: "index_favorite_items_on_membership_id"
  end

  create_table "featured_items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "library_item_id"
    t.string "image_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "item_type"
    t.index ["item_type"], name: "index_featured_items_on_item_type"
    t.index ["library_item_id"], name: "index_featured_items_on_library_item_id"
  end

  create_table "genre_items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "genre_id"
    t.uuid "item_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "item_type"
    t.index ["genre_id"], name: "index_genre_items_on_genre_id"
    t.index ["item_id"], name: "index_genre_items_on_item_id"
    t.index ["item_type"], name: "index_genre_items_on_item_type"
  end

  create_table "genres", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "images", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "picture_file_name", null: false
    t.string "picture_file_size"
    t.string "picture_content_type"
    t.string "picture_updated_at"
    t.string "imageable_type", null: false
    t.uuid "imageable_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["imageable_type", "imageable_id"], name: "index_images_on_imageable"
  end

  create_table "invoice_details", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "borrow_date"
    t.float "amount"
    t.integer "quantity"
    t.uuid "borrowed_item_id"
    t.uuid "invoice_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["borrowed_item_id"], name: "index_invoice_details_on_borrowed_item_id"
    t.index ["invoice_id"], name: "index_invoice_details_on_invoice_id"
  end

  create_table "invoices", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.float "total"
    t.string "invoice_no"
    t.uuid "library_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "status"
    t.date "due_date"
    t.date "billing_start_date"
    t.date "billing_end_date"
    t.index ["library_id"], name: "index_invoices_on_library_id"
    t.index ["status"], name: "index_invoices_on_status"
  end

  create_table "item_types", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "code"
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "title", default: "", null: false
    t.text "description"
    t.string "publisher_name"
    t.date "publish_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "amount"
    t.integer "page_count"
    t.string "volume_no"
    t.string "age_rating"
    t.string "name"
    t.string "issue_no"
    t.date "cover_date"
    t.text "cast"
    t.text "writer_team"
    t.text "pencil_team"
    t.text "ink_team"
    t.text "color_team"
    t.text "letter_team"
    t.text "editor_team"
    t.text "cover_art_team"
    t.string "issue_url"
    t.string "cover_url"
    t.string "status"
    t.bigint "bcaf_item_number"
    t.string "item_type"
    t.string "duration"
    t.string "series_name"
    t.integer "season_no"
    t.integer "episode_no"
    t.string "director_team"
    t.string "trailer_url"
    t.string "synopsis"
    t.string "video_type"
    t.string "studio_name"
    t.string "image_url"
    t.string "item_type_code"
    t.index ["bcaf_item_number"], name: "index_items_on_bcaf_item_number", unique: true
    t.index ["status"], name: "index_items_on_status"
  end

  create_table "libraries", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", default: "", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email"
    t.string "status"
    t.string "url"
    t.string "access_token"
    t.string "access_key"
    t.string "access_url"
    t.string "select_image_url"
    t.string "login_image_url"
    t.string "logo_url"
    t.string "domain"
    t.string "pin_url"
    t.index ["domain"], name: "index_libraries_on_domain"
  end

  create_table "library_cards", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "library_key"
    t.string "card_id"
    t.string "library_name"
    t.string "member_name"
    t.string "access_token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["card_id"], name: "index_library_cards_on_card_id"
    t.index ["library_key"], name: "index_library_cards_on_library_key"
  end

  create_table "library_items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "library_id"
    t.uuid "item_id"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "amount"
    t.string "isbn"
    t.string "language"
    t.datetime "last_marc_date"
    t.string "item_type"
    t.string "item_type_code"
    t.index ["item_id"], name: "index_library_items_on_item_id"
    t.index ["item_type"], name: "index_library_items_on_item_type"
    t.index ["library_id"], name: "index_library_items_on_library_id"
  end

  create_table "library_reports", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "title"
    t.string "description"
    t.string "status"
    t.boolean "admin_flg"
    t.uuid "library_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["library_id"], name: "index_library_reports_on_library_id"
  end

  create_table "library_settings", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "borrow_days"
    t.integer "max_item_quantity"
    t.integer "max_borrow_quantity"
    t.uuid "library_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["library_id"], name: "index_library_settings_on_library_id"
  end

  create_table "library_support_tickets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "library_id", null: false
    t.string "support_category_code"
    t.uuid "membership_id", null: false
    t.text "description"
    t.string "status"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["library_id"], name: "index_library_support_tickets_on_library_id"
    t.index ["membership_id"], name: "index_library_support_tickets_on_membership_id"
    t.index ["status"], name: "index_library_support_tickets_on_status"
  end

  create_table "library_users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.uuid "library_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "status"
    t.index ["library_id"], name: "index_library_users_on_library_id"
    t.index ["status"], name: "index_library_users_on_status"
    t.index ["user_id"], name: "index_library_users_on_user_id"
  end

  create_table "memberships", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "card_no"
    t.string "status"
    t.uuid "library_id"
    t.uuid "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "membership_type"
    t.index ["card_no", "library_id"], name: "index_memberships_on_card_no_and_library_id", unique: true
    t.index ["library_id"], name: "index_memberships_on_library_id"
    t.index ["user_id"], name: "index_memberships_on_user_id"
  end

  create_table "roles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "resource_type"
    t.bigint "resource_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id"
    t.index ["resource_type", "resource_id"], name: "index_roles_on_resource"
  end

  create_table "support_categories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "code"
    t.string "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["code"], name: "index_support_categories_on_code"
  end

  create_table "task_records", id: false, force: :cascade do |t|
    t.string "version", null: false
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.string "authentication_token", limit: 30
    t.string "status"
    t.index ["authentication_token"], name: "index_users_on_authentication_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["status"], name: "index_users_on_status"
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.uuid "user_id"
    t.uuid "role_id"
    t.index ["role_id"], name: "index_users_roles_on_role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id"
    t.index ["user_id"], name: "index_users_roles_on_user_id"
  end

  create_table "videos", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.text "synopsis"
    t.string "studio_name"
    t.string "production_team"
    t.string "director_name"
    t.string "age_rating"
    t.date "release_date"
    t.string "issue_url"
    t.string "cover_url"
    t.string "trailer_url"
    t.string "series_artwork_url"
    t.string "closed_caption_url"
    t.string "status"
    t.bigint "bcaf_item_number"
    t.string "item_type"
    t.string "season_no"
    t.string "series_name"
    t.string "episode_no"
    t.date "cover_date"
    t.text "cast"
    t.text "writer_team"
    t.text "editor_team"
    t.text "ink_team"
    t.text "animation_team"
    t.string "video_type"
    t.string "music_by"
    t.string "duration"
    t.string "external_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "genre"
    t.index ["genre"], name: "index_videos_on_genre"
    t.index ["item_type"], name: "index_videos_on_item_type"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "active_storage_blobs_id"
  add_foreign_key "borrowed_items", "library_items"
  add_foreign_key "borrowed_items", "memberships"
  add_foreign_key "categories", "libraries"
  add_foreign_key "favorite_items", "library_items"
  add_foreign_key "favorite_items", "memberships"
  add_foreign_key "featured_items", "library_items"
  add_foreign_key "genre_items", "genres"
  add_foreign_key "genre_items", "items"
  add_foreign_key "invoice_details", "borrowed_items"
  add_foreign_key "invoice_details", "invoices"
  add_foreign_key "invoices", "libraries"
  add_foreign_key "library_items", "items"
  add_foreign_key "library_items", "libraries"
  add_foreign_key "library_reports", "libraries"
  add_foreign_key "library_settings", "libraries"
  add_foreign_key "library_support_tickets", "libraries"
  add_foreign_key "library_support_tickets", "memberships"
  add_foreign_key "library_users", "libraries"
  add_foreign_key "library_users", "users"
  add_foreign_key "memberships", "libraries"
  add_foreign_key "memberships", "users"
  add_foreign_key "users_roles", "roles"
  add_foreign_key "users_roles", "users"

  create_view "trending_title_views", sql_definition: <<-SQL
      SELECT items.name,
      items.issue_no,
      items.writer_team,
      items.publisher_name,
      sum(borrowed_items.quantity) AS quantity
     FROM ((borrowed_items
       JOIN library_items ON ((library_items.item_id = borrowed_items.library_item_id)))
       JOIN items ON ((items.id = borrowed_items.library_item_id)))
    GROUP BY items.name, items.issue_no, items.writer_team, items.publisher_name;
  SQL
  create_view "trending_title_list_view", sql_definition: <<-SQL
      SELECT borrowed_items.library_item_id,
      items.title,
      items.name AS item_name,
      items.item_type,
      items.publisher_name,
      genres.name AS genre_name,
      borrowed_items.quantity,
      library_items.amount,
      libraries.name AS library_name,
      libraries.id AS library_id,
      borrowed_items.created_at AS borrow_date,
      borrowed_items.status AS borrow_status,
      borrowed_items.membership_id AS member_id
     FROM (((((borrowed_items
       JOIN library_items ON ((library_items.id = borrowed_items.library_item_id)))
       JOIN items ON ((items.id = library_items.item_id)))
       JOIN libraries ON ((libraries.id = library_items.library_id)))
       LEFT JOIN genre_items ON ((genre_items.item_id = items.id)))
       LEFT JOIN genres ON ((genres.id = genre_items.genre_id)));
  SQL
  create_view "checkout_item_summary_view", sql_definition: <<-SQL
      SELECT b.library_item_id,
      count(b.library_item_id) AS item_count,
      i.title,
      i.name AS item_name,
      i.item_type,
      i.publisher_name,
      g.name AS genre_name,
      sum(b.quantity) AS quantity,
      sum(li.amount) AS amount,
      sum(((b.quantity)::double precision * li.amount)) AS item_total,
      l.name AS library_name,
      l.id AS library_id,
      (b.created_at)::date AS borrow_date,
      b.status AS borrow_status,
      b.membership_id AS member_id
     FROM (((((borrowed_items b
       JOIN library_items li ON ((li.id = b.library_item_id)))
       JOIN items i ON ((i.id = li.item_id)))
       JOIN libraries l ON ((l.id = li.library_id)))
       LEFT JOIN genre_items gi ON ((gi.item_id = i.id)))
       LEFT JOIN genres g ON ((g.id = gi.genre_id)))
    GROUP BY b.library_item_id, i.title, i.name, i.item_type, i.publisher_name, g.name, l.name, l.id, ((b.created_at)::date), b.status, b.membership_id;
  SQL
  create_view "library_item_summary_view", sql_definition: <<-SQL
      SELECT li.id AS library_item_id,
      i.title,
      i.name AS item_name,
      i.item_type,
      i.age_rating,
      i.publisher_name,
      i.writer_team,
      g.name AS genre_name,
      l.name AS library_name,
      l.id AS library_id,
      (li.created_at)::date AS create_date,
      i.status AS item_status,
      i.issue_url,
      i.cover_url,
      i.trailer_url,
      i.image_url,
      i.description
     FROM ((((library_items li
       JOIN items i ON ((i.id = li.item_id)))
       JOIN libraries l ON ((l.id = li.library_id)))
       LEFT JOIN genre_items gi ON ((gi.item_id = i.id)))
       LEFT JOIN genres g ON ((g.id = gi.genre_id)));
  SQL
end
