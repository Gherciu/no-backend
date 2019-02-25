
import getRecursiveRelationTables from './helpers/getRecursiveRelationTables';
import injectToSquel from './helpers/injectToSquel';

const buildTablesGraphQlQuerysResolvers = async (options,tables,db) => {

    let tablesQuerysResolvers = {}

    tables.forEach((tableObject) => {

        let tableName = Object.values(tableObject)[0]
        let tableDesc = Object.values(tableObject)[1]
        let relationsFields = tableDesc.filter((item)=>new RegExp(/\_/ig).test(item.Field))
        
        tablesQuerysResolvers[tableName] = async (_,__,context) => {

            let args = _?_:__ //for apollo resolvers (args = __) for graphql resolvers (args = _)
            let squel = db.select().from(tableName)
            squel = injectToSquel( db,squel,args.filters,args.limit,args.offset,args.order )

            let statementResult = await db.exec( squel )
            let recursiveStatementResult = await getRecursiveRelationTables(statementResult,relationsFields,tables,db)

            return recursiveStatementResult

        }

    })

    return {
        tablesQuerysResolvers
    }

}

export default buildTablesGraphQlQuerysResolvers