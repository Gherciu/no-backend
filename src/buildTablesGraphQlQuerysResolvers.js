
import injectToSquel from './helpers/injectToSquel'
import getInsertIds from './helpers/getInsertIds'

const buildTablesGraphQlQuerysResolvers = async (options,tables,db) => {

    let tablesQuerysResolvers = {}

    tables.forEach((tableObject) => {

        let tableName = Object.values(tableObject)[0]
        let tableDesc = Object.values(tableObject)[1] 
        
        tablesQuerysResolvers[tableName] = async (root,args,context) => {
            
            let squel = db.select().from(tableName)
            squel = injectToSquel( db,squel,root.filters,root.limit,root.offset,root.order )

            let statementResult = await db.exec( squel )

            return statementResult

        }

    })

    return {
        tablesQuerysResolvers
    }

}

export default buildTablesGraphQlQuerysResolvers