import optionsValidator from './optionsValidator'
import middleware from './middleware'

const dbMiddleware = (options)=>{

    const optionsValidatorMessage = optionsValidator(options)

    if(optionsValidatorMessage)
        throw(optionsValidatorMessage)
    else
        return middleware(options)

}

export default dbMiddleware