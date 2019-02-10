import optionsValidator from './optionsValidator'
import buildGraphQlSchemaAndResolvers from './buildGraphQlSchemaAndResolvers'
import graphQlMiddleware from './graphQlMiddleware'

const noBackend = (options)=>{

    const optionsValidatorMessage = optionsValidator(options)

    if(optionsValidatorMessage){
        throw new Error(optionsValidatorMessage)
    }else{
        const { schema, resolvers } = buildGraphQlSchemaAndResolvers(options)
        return graphQlMiddleware( options,schema,resolvers )
    }

}

export default noBackend