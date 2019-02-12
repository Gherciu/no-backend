import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
  } from 'graphql';

const getFieldType = (rawType) => {
    return {type: GraphQLString}
}
const buildQueries = (tables) => {
    let types = {}
    const recursiveRegisterTableType = (tableName,tableDesc) => {
        if(!types[tableName]){
            if(false){//if contain a column with foreign key in tableDesc

            }else{
                let tableType = new GraphQLObjectType({
                    name:tableName,
                    description:'',
                    fields: () => {
                        let tableFields = {}
                        tableDesc.forEach((fieldObject) => {
                             tableFields[fieldObject.Field] = getFieldType(tableFields[fieldObject.Type])
                        })
                        return tableFields
                    }
                })
                types[tableName] = {type :new GraphQLNonNull(new GraphQLList(tableType))}
            }
        }
    }
    tables.forEach((tableObject) => {
        let tableName = Object.values(tableObject)[0]
        let tableDesc = Object.values(tableObject)[1]
        recursiveRegisterTableType(tableName,tableDesc)
    })

    return {
        query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            ...types
        }
        })
    }

}

const buildTablesSchema = async (options,tables,db) => {
    
    let query = await buildQueries(tables)

    return new GraphQLSchema({...query})

}

export default buildTablesSchema