import { GraphQLObjectType } from 'graphql'
import buildGraphQlArgs from './helpers/buildGraphQlArgs'
import {firstToUpperCase} from './helpers/textHelpers'

const buildTablesGraphQlMutations = ( tables,tablesTypes ) => {

    let mutationsMethods = ['insert','update','delete']
    let tablesMutationTypes = {}

    for (const tableTypeKey in tablesTypes) {

        let currentTableObject = tables.filter((tableObject)=> /*tableName*/Object.values(tableObject)[0] === tableTypeKey)
        let tableName = Object.values(currentTableObject[0])[0]
        let tableDesc = Object.values(currentTableObject[0])[1]

        mutationsMethods.forEach((mutationMethod) => {
            tablesMutationTypes[`${mutationMethod}${firstToUpperCase(tableTypeKey)}`] = {
                ...tablesTypes[tableTypeKey],
               args: {
                   ...buildGraphQlArgs(tableName,tableDesc,'mutation',mutationMethod)
               }
           }
        })

    }

    return {
        mutation: new GraphQLObjectType({
            name: 'Mutation',
            description:'GraphQl root mutation type',
            fields: {
                ...tablesMutationTypes
            }
        })
    }

}

export default buildTablesGraphQlMutations