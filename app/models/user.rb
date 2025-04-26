class User < ApplicationRecord
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  
  has_many :memberships, dependent: :destroy
  has_many :library_users, dependent: :destroy
  
  # Token authentication
  acts_as_token_authenticatable
  
  def name
    "#{first_name} #{last_name}"
  end
end 