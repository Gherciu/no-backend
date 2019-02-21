
import injectToSquel from './helpers/injectToSquel'
import getRecursiveRelationTables from './helpers/getRecursiveRelationTables'

const buildTablesGraphQlQuerysResolvers = async (options,tables,db) => {

    let tablesQuerysResolvers = {}

    tables.forEach((tableObject) => {

        let tableName = Object.values(tableObject)[0]
        let tableDesc = Object.values(tableObject)[1]
        let relationsFields = tableDesc.filter((item)=>new RegExp(/\_/ig).test(item.Field))
        
        tablesQuerysResolvers[tableName] = async (root,args,context) => {
            
            let squel = db.select().from(tableName)
            squel = injectToSquel( db,squel,root.filters,root.limit,root.offset,root.order )

            let statementResult = await db.exec( squel )
            let result = await getRecursiveRelationTables(statementResult,relationsFields,tables,db)

            return result

        }

    })

    return {
        tablesQuerysResolvers
    }

}

export default buildTablesGraphQlQuerysResolvers