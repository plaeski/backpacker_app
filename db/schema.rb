# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160301190624) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "cities", force: :cascade do |t|
    t.string   "name"
    t.integer  "country_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "cities", ["country_id"], name: "index_cities_on_country_id", using: :btree

  create_table "comments", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "content"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "trip_id"
  end

  add_index "comments", ["trip_id"], name: "index_comments_on_trip_id", using: :btree
  add_index "comments", ["user_id"], name: "index_comments_on_user_id", using: :btree

  create_table "countries", force: :cascade do |t|
    t.string   "country"
    t.string   "currency"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "country_expenses", force: :cascade do |t|
    t.string   "expense_type"
    t.string   "currency"
    t.float    "total"
    t.integer  "country_id"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  add_index "country_expenses", ["country_id"], name: "index_country_expenses_on_country_id", using: :btree

  create_table "identities", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "provider"
    t.string   "uid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "identities", ["user_id"], name: "index_identities_on_user_id", using: :btree

  create_table "itineraries", force: :cascade do |t|
    t.text     "cities",     default: [],              array: true
    t.text     "countries",  default: [],              array: true
    t.string   "area"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  create_table "trip_memberships", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "trip_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "trip_memberships", ["trip_id"], name: "index_trip_memberships_on_trip_id", using: :btree
  add_index "trip_memberships", ["user_id"], name: "index_trip_memberships_on_user_id", using: :btree

  create_table "trip_routes", force: :cascade do |t|
    t.json     "route_details"
    t.integer  "trip_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "trip_routes", ["trip_id"], name: "index_trip_routes_on_trip_id", using: :btree

  create_table "trips", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.integer  "trip_code"
    t.integer  "itinerary_id"
  end

  add_index "trips", ["itinerary_id"], name: "index_trips_on_itinerary_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "name"
    t.string   "provider"
    t.string   "uid"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  add_foreign_key "comments", "trips"
  add_foreign_key "identities", "users"
end
