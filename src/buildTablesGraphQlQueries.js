import { GraphQLObjectType } from 'graphql'
import buildGraphQlArgs from './helpers/buildGraphQlArgs'

const buildTablesGraphQlQueries = (tables,tablesTypes) => {

    let tablesQueryTypes = {}

    for (const tableTypeKey in tablesTypes) {
        
        let currentTableObject = tables.filter((tableObject)=> /*tableName*/Object.values(tableObject)[0] === tableTypeKey)
        let tableName = Object.values(currentTableObject[0])[0]
        let tableDesc = Object.values(currentTableObject[0])[1]
            
        tablesQueryTypes[tableTypeKey] = {
             ...tablesTypes[tableTypeKey],
            args: {
                ...buildGraphQlArgs(tableName,tableDesc,'query')
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