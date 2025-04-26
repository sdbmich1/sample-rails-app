namespace :db do
  desc "Checks to see if the database exists"
  task :exists do
    begin
      Rake::Task['environment'].invoke
      ActiveRecord::Base.connection
    rescue => e
      puts "Database doesn't exist: #{e.message}"
      exit 1
    else
      puts "Database exists"
      exit 0
    end
  end
end 