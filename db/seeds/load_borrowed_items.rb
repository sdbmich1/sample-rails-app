    # load borrowed items
    lib = Library.find_by domain: 'sfpl'
    # member1 = lib.memberships.first
    # lib_item1 = lib.library_items.first
    # # bi = lib_item1.borrowed_items.build(membership_id: member1.id, status: 'active')
    # lib_item2 = lib.library_items.second
    # lib_item3 = lib.library_items.third
    # lib_item4 = lib.library_items.fourth
    # lib_item5 = lib.library_items.fifth

    def load_borrowed_items(model:, cnt: 10, member:, qty: 1)
      cnt.times do |i|
        model.borrowed_items.build(membership: member, status: 'active', quantity: qty)
      end
      model.save
    end

    # load the first item
    load_borrowed_items(model: lib.library_items.first, 
                        member: lib.memberships.first,
                        qty: 3 )

    load_borrowed_items(model: lib.library_items.second, 
                        member: lib.memberships.first,
                        qty: 2 )
  
    load_borrowed_items(model: lib.library_items.third, 
                        member: lib.memberships.second,
                        cnt: 5,
                        qty: 5 )
  
    load_borrowed_items(model: lib.library_items.fourth, 
                        member: lib.memberships.first,
                        qty: 1 )

    load_borrowed_items(model: lib.library_items.fifth, 
                        member: lib.memberships.second,
                        qty: 4 )
    