const tablesSchema = {
    products:{
        id:'number',
        name:'string',
        description:'string',
        category_id:'number',
        _rules:{
            limit:100,
            create:true,
            read:true,
            update:true,
            delete:true
        }
    }
}

module.exports = tablesSchema