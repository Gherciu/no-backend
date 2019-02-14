const buildTablesResolvers = async (options,tables,db) => {

    let resolvers = {
       hello: ()=>{
           return 'Hello!'
       }
    }

    return resolvers

}

export default buildTablesResolvers