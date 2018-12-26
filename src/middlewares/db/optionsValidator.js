const optionsValidator = (options)=>{

    if(options.db){
        if(typeof options.db !== 'object')
            return 'Error:Option db is not an object!'
    }else{
        return 'Error:Option db is required!'
    }
    if(options.tablesRules){
        if(typeof options.tablesRules !== 'object')
            return 'Error:Option tablesRules is not an object!'
    }

    return false

}

export default optionsValidator