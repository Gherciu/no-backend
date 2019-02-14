const optionsValidator = (options)=>{
    if(!options.app){
        return 'Error:Option app is required!'
    }
    if(options.route){
        if(typeof options.route !== 'string')
            return 'Error:Option route is not a string!'
    }else{
        return 'Error:Option route is required!'
    }
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