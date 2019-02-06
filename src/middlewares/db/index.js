import optionsValidator from './optionsValidator'
import middleware from './middleware'
import registerGlobalNoBackendValues from './../../common/registerGlobalNoBackendValues'
import {globalNoBackendKeyNameOfMiddlewaresRoutes} from './../../common/strings'
import graphQlErrorMiddleware from './../../common/graphQlErrorMiddleware'

const dbMiddleware = (options)=>{

    const optionsValidatorMessage = optionsValidator(options)

    if(optionsValidatorMessage){
        return graphQlErrorMiddleware(options,optionsValidatorMessage)
    }
    else{
        registerGlobalNoBackendValues(globalNoBackendKeyNameOfMiddlewaresRoutes,[
            {
                type:'db',
                route:options.route
            }
        ])
        return middleware(options)
    }

}

export default dbMiddleware