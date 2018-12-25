import buildTablesSchema from './buildTablesSchema'

const middleware = (options) => {
    
    let tablesSchema;

    if(options.tablesSchema)
        tablesSchema = options.tablesSchema
    else
        tablesSchema = buildTablesSchema(options)

    return (req,res) => {
        res.json(options)
    }

}

export default middleware