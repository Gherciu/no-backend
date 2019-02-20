
import {isEmpty} from './helpers/objectsHelpers'
import {singularToPlural} from './helpers/textHelpers'

const buildTablesGraphQlQuerysResolvers = async (options,tables,db) => {

    let tablesQuerysResolvers = {}

    tables.forEach((tableObject) => {

        let tableName = Object.values(tableObject)[0]
        let tableDesc = Object.values(tableObject)[1]
        
        tablesQuerysResolvers[tableName] = async (root,args,context) => {
            return await db.exec( db.select().from(tableName) )
        }

    })

    return {
        tablesQuerysResolvers
    }

}

export default buildTablesGraphQlQuerysResolvers