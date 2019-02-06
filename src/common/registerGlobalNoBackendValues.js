const registerGlobalNoBackendValues = (key,value) => {
    if(global.__noBackend){
        if(global.__noBackend[key]){
            if(Array.isArray(global.__noBackend[key])){
                global.__noBackend[key] = [...global.__noBackend[key],value]
            }else if (typeof global.__noBackend[key] === 'object'){
                global.__noBackend[key] = {...global.__noBackend[key], ...value}
            }else{
                global.__noBackend[key] = value
            }
        }else{
            global.__noBackend[key] = value
        }
    }else{
       global.__noBackend = {}
       global.__noBackend[key] = value
    }
}

export default registerGlobalNoBackendValues