import {GraphQLNonNull,GraphQLList,GraphQLObjectType,GraphQLInt,GraphQLString} from 'graphql'
import buildGraphQlArgs from './helpers/buildGraphQlArgs'
import {firstToUpperCase} from './helpers/textHelpers'
import { tablesMutationsMethods } from './helpers/constants'

const statementResultType = new GraphQLObjectType({
    name:'statementResult',
    description:'Statement result',
    fields:{
        affectedRows: {type:GraphQLInt},
        changedRows: {type:GraphQLInt},
        insertId: {type:GraphQLInt},
        fieldCount: {type:GraphQLInt},
        warningCount: {type:GraphQLInt},
        message:{type:GraphQLString},
        insertIds:{type:new GraphQLNonNull(new GraphQLList(GraphQLInt))}
    }
})  
const buildTablesGraphQlMutations = ( tables,tablesTypes ) => {

    let tablesMutationsTypes = {}

    for (const tableTypeKey in tablesTypes) {

        let currentTableObject = tables.filter((tableObject)=> /*tableName*/Object.values(tableObject)[0] === tableTypeKey)
        let tableName = Object.values(currentTableObject[0])[0]
        let tableDesc = Object.values(currentTableObject[0])[1]

        tablesMutationsMethods.forEach((mutationMethod) => {
            tablesMutationsTypes[`${mutationMethod}${firstToUpperCase(tableTypeKey)}`] = {
               type: new GraphQLNonNull( statementResultType ),
               args: {
                   ...buildGraphQlArgs(tableName,tableDesc,'mutation',mutationMethod)
               }
           }
        })

    }

    return {
        tablesMutationsTypes
    }

}

export default buildTablesGraphQlMutations