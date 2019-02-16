import { GraphQLObjectType } from 'graphql'
import buildGraphQlArgs from './helpers/buildGraphQlArgs'

const buildTablesGraphQlQueries = (tablesTypes) => {

    let tablesQueryTypes = {}

    for (const tableTypeKey in tablesTypes) {
        
        tablesQueryTypes[tableTypeKey] = {
             ...tablesTypes[tableTypeKey],
            args: {
                ...buildGraphQlArgs()
            }
        }

    }

    return {
        query: new GraphQLObjectType({
            name: 'Query',
            description:'GraphQl root query type',
            fields: {
                ...tablesQueryTypes
            }
        })
    }

}

export default buildTablesGraphQlQueries