import optionsValidator from './optionsValidator'
import middleware from './middleware'
import graphQlErrorMiddleware from './../../common/graphQlErrorMiddleware'

const dbMiddleware = (options)=>{

    const optionsValidatorMessage = optionsValidator(options)

    if(optionsValidatorMessage){
        return graphQlErrorMiddleware(options,optionsValidatorMessage)
    }
    else{
        return middleware(options)
    }

}

export default dbMiddleware