
import { tablesRules } from './helpers/constants';
import getRecursiveRelationTables from './helpers/getRecursiveRelationTables';
import injectToSquel from './helpers/injectToSquel';
import tablesRulesReader from './helpers/tablesRulesReader';

const buildTablesGraphQlQuerysResolvers = async (options,tables,db) => {

    let tablesQuerysResolvers = {}

    tables.forEach((tableObject) => {

        let tableName = Object.values(tableObject)[0]
        let tableDesc = Object.values(tableObject)[1]
        let relationsFields = tableDesc.filter((item)=>new RegExp(/\_/ig).test(item.Field))
        
        tablesQuerysResolvers[tableName] = async (_,args,context) => {

            let isActionAllowed = tablesRulesReader(options.tablesRules,context.req,tablesRules['read'],tableName)

            if(isActionAllowed){

                let squel = db.select().from(tableName)
                squel = injectToSquel( db,squel,args.filters,args.limit,args.offset,args.order )

                let statementResult = await db.exec( squel )
                let recursiveStatementResult = await getRecursiveRelationTables(statementResult,relationsFields,tables,db)

                return recursiveStatementResult

            }else{
                throw new Error(`Action (${tablesRules['read']}) is not allowed for table (${tableName})`)
            }

        }

    })

    return {
        tablesQuerysResolvers
    }

}

export default buildTablesGraphQlQuerysResolvers