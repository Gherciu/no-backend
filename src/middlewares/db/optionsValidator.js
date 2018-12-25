const optionsValidator = (options)=>{

    if(options.db){
        if(typeof options.db !== 'object')
            return 'Error:Option db is not an object!'
    }else{
        return 'Error:Option db is required!'
    }
    if(options.tablesSchema){
        if(typeof options.tablesSchema !== 'object')
            return 'Error:Option tablesSchema is not an object!'
        if(Object.keys(options.tablesSchema).length > 0)
            Object.values(options.tablesSchema).forEach((table,index)=>{
                if(table._rules)
                    if(typeof table._rules !== 'object')
                        throw(`Error:Option _rules for table with index ${index} is not an object!`)
            })
        else
            return 'Error:Minimum one table in tablesSchema is required!'
    }

    return false

}

export default optionsValidator