import { GraphQLObjectType } from 'graphql'
import buildGraphQlArgs from './helpers/buildGraphQlArgs'
import {firstToUpperCase} from './helpers/textHelpers'

const buildTablesGraphQlMutations = ( tables,tablesTypes,tablesRowTypes ) => {

    let mutationsMethods = ['insert','update','delete']
    let tablesMutationTypes = {}

    for (const tableTypeKey in tablesTypes) {

        let tableDesc = tables.filter((tableObject)=> /*tableName*/Object.values(tableObject)[0] === tableTypeKey)
            tableDesc = tableDesc[0].desc

        mutationsMethods.forEach((mutationMethod) => {
            tablesMutationTypes[`${mutationMethod}${firstToUpperCase(tableTypeKey)}`] = {
                ...tablesTypes[tableTypeKey],
               args: {
                   ...buildGraphQlArgs(tableDesc,'mutation',mutationMethod)
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