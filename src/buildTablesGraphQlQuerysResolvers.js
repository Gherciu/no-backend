
import { rules } from './helpers/constants';
import getRecursiveRelationTables from './helpers/getRecursiveRelationTables';
import injectToSquel from './helpers/injectToSquel';
import rulesReader from './helpers/rulesReader';

const buildTablesGraphQlQuerysResolvers = async (options,tables,db) => {

    let tablesQuerysResolvers = {}

    tables.forEach((tableObject) => {

        let tableName = Object.values(tableObject)[0]
        let tableDesc = Object.values(tableObject)[1]
        let relationsFields = tableDesc.filter((item)=>new RegExp(/\_/ig).test(item.Field))
        
        tablesQuerysResolvers[tableName] = async (_,args,context) => {

            if(args.__rawGraphQlRequest__){//if is a raw graphql request read more in file(buildNoBackendControllers.js)
                context = {...args}
                args = _
            }
            let isActionAllowed = rulesReader(options.rules,context.req,rules['read'],tableName)

            if(isActionAllowed){

                let squel = db.select().from(tableName)
                squel = injectToSquel( db,squel,args.filters,args.limit,args.offset,args.order )

                let statementResult = await db.exec( squel )
                let recursiveStatementResult = await getRecursiveRelationTables(statementResult,relationsFields,tables,db)

                return recursiveStatementResult

            }else{
                throw new Error(`Action (${rules['read']}) is not allowed for table (${tableName})`)
            }

        }

    })

    return {
        tablesQuerysResolvers
    }

}

export default buildTablesGraphQlQuerysResolvers