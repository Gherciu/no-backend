import buildGraphQlSchemaAndResolvers from './buildGraphQlSchemaAndResolvers'
import { graphql} from 'graphql'
import renderGraphiql from './renderGraphiql'
import graphQlMiddleware from './../../common/graphQlMiddleware'

const middleware = (options) => {
    
    const { schema, resolvers } = buildGraphQlSchemaAndResolvers(options)
  
    return graphQlMiddleware( options,schema,resolvers )

}

export default middleware