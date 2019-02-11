import optionsValidator from './optionsValidator'
import buildGraphQlSchemaAndResolvers from './buildGraphQlSchemaAndResolvers'
import registerMiddleware from './registerMiddleware'

const noBackend = async ( options )=>{
    const optionsValidatorMessage = optionsValidator( options )

    if( optionsValidatorMessage ){
        throw new TypeError( optionsValidatorMessage )
    }else{
        let { schema,resolvers } = await buildGraphQlSchemaAndResolvers( options )
        registerMiddleware( options,schema,resolvers )
    }

}

export default noBackend