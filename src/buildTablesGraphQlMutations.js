import buildGraphQlArgs from './helpers/buildGraphQlArgs'
import {firstToUpperCase} from './helpers/textHelpers'
import { tablesMutationsMethods } from './helpers/constants'

const buildTablesGraphQlMutations = ( tables,tablesTypes ) => {

    let tablesMutationsTypes = {}

    for (const tableTypeKey in tablesTypes) {

        let currentTableObject = tables.filter((tableObject)=> /*tableName*/Object.values(tableObject)[0] === tableTypeKey)
        let tableName = Object.values(currentTableObject[0])[0]
        let tableDesc = Object.values(currentTableObject[0])[1]

        tablesMutationsMethods.forEach((mutationMethod) => {
            tablesMutationsTypes[`${mutationMethod}${firstToUpperCase(tableTypeKey)}`] = {
                ...tablesTypes[tableTypeKey],
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