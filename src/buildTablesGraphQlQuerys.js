import buildGraphQlArgs from './helpers/buildGraphQlArgs'

const buildTablesGraphQlQuerys = (tables,tablesTypes) => {

    let tablesQuerysTypes = {}

    for (const tableTypeKey in tablesTypes) {
        
        let currentTableObject = tables.filter((tableObject)=> /*tableName*/Object.values(tableObject)[0] === tableTypeKey)
        let tableName = Object.values(currentTableObject[0])[0]
        let tableDesc = Object.values(currentTableObject[0])[1]
            
        tablesQuerysTypes[tableTypeKey] = {
             ...tablesTypes[tableTypeKey],
            args: {
                ...buildGraphQlArgs(tableName,tableDesc,'query')
            }
        }

    }

    return {
        tablesQuerysTypes
    }

}

export default buildTablesGraphQlQuerys