import { GraphQLObjectType } from 'graphql'
import buildGraphQlArgs from './helpers/buildGraphQlArgs'

const buildTablesGraphQlQueries = (tables,tablesTypes) => {

    let tablesQueryTypes = {}

    for (const tableTypeKey in tablesTypes) {
        
        let tableDesc = tables.filter((tableObject)=> /*tableName*/Object.values(tableObject)[0] === tableTypeKey)
            tableDesc = tableDesc[0].desc
            
        tablesQueryTypes[tableTypeKey] = {
             ...tablesTypes[tableTypeKey],
            args: {
                ...buildGraphQlArgs(tableDesc,'query')
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