# load library items
Library.all.each do |library|
  library.library_reports.create(title: 'Trending Titles Report', status: 'active', description: 'Trending Titles report')    
  library.library_reports.create(title: 'Checkout Books Report', status: 'active', description: 'Checkout Books report')    
  library.library_reports.create(title: 'Invoice Report', status: 'active', description: 'Invoices report', admin_flg: true)
  library.library_reports.create(title: 'Checkout Items Report', status: 'active', description: 'Checkout Items report')
  library.library_reports.create(title: 'Data Dashboard', status: 'inactive', description: 'Data Dashboard Chart')
end

