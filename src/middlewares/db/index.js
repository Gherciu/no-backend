import optionsValidator from './optionsValidator'
import middleware from './middleware'
import errorMiddleware from './errorMiddleware'

const dbMiddleware = (options)=>{

    const optionsValidatorMessage = optionsValidator(options)

    if(optionsValidatorMessage){
        return errorMiddleware(options,optionsValidatorMessage)
    }
    else{
        return middleware(options)
    }

}

export default dbMiddleware