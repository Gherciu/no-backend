const optionsValidator = (options)=>{
    
    if(options.connection){
        if(typeof options.connection !== 'object')
            return 'Error:Option connection is not a object!'
    }else{
        return 'Error:Option connection is required!'
    }
    if(options.rules){
        if(typeof options.rules !== 'object')
            return 'Error:Option rules is not an object!'
    }

    return false

}

export default optionsValidator