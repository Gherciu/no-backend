import { GraphQLString,GraphQLInt,GraphQLInputObjectType,GraphQLScalarType,GraphQLList,GraphQLNonNull } from 'graphql'
import { Kind } from 'graphql/language';
import getColumnGraphQlType from './getColumnGraphQlType'
import { pluralToSingular, firstToUpperCase } from './textHelpers'

const whereType = new GraphQLInputObjectType({
    name:'whereStatement',
    description:'whereStatement GraphQl type, usage ex:({ columnName:"id",clause:"< 3" })',
    fields:{
        columnName:{type:new GraphQLNonNull(GraphQLString)},
        operator:{type:new GraphQLNonNull(GraphQLString)},
        expression:{type:new GraphQLNonNull(
            new GraphQLScalarType({
                name: 'expression',
                description: 'The `expression` scalar type represents a string,number or boolean.',
                serialize(value) {
                    return value
                },
                parseValue(value) {
                    return value
                },
                parseLiteral(ast) {
                    if(ast.kind === Kind.INT){
                        return parseInt(ast.value)
                    }
                    else if(ast.kind === Kind.FLOAT){
                        return parseFloat(ast.value)
                    }
                    else if(ast.kind === Kind.BOOLEAN){
                        return ast.value
                    }
                    else if(ast.kind === Kind.STRING){
                        return ast.value.toString()
                    }
                    else{
                        throw new TypeError('`expression`: Expected type Int,Float or String, found other type!')
                    }
                }
            })
        )}
    }
})
const filtersArgs = {
    filters: { 
        type: new GraphQLList(
                 new GraphQLNonNull(
                    new GraphQLInputObjectType({
                        name:'filter',
                        fields:{
                            where:{type:new GraphQLNonNull(whereType)
                            },
                            and: { type:  new GraphQLList( new GraphQLNonNull(whereType) ) },
                            or: { type: new GraphQLList( new GraphQLNonNull(whereType) ) },
                        }
                    })
                 )
            )
        }
}
const defaultArgs = {
    id: { type: GraphQLInt }
}
const paginationArgs = {
    limit: { type: GraphQLInt },
    offset: { type: GraphQLInt },
    order: { type:new GraphQLList(
            new GraphQLNonNull(
                new GraphQLInputObjectType({
                    name:'orderStatement',
                    fields:{
                        key:{type:new GraphQLNonNull(GraphQLString)},
                        direction:{type:new GraphQLNonNull(GraphQLString)}
                    }
                })
            )
        ) 
    }
}
const buildGraphQlArgs = ( tableName,tableDesc,argumentsFor,argumentsForMethod ) => {
    
    let args = { }

    if(argumentsFor === 'mutation'){

        switch (argumentsForMethod) {
            case 'insert':{
                args = {
                    [tableName]: {
                        type: new GraphQLList(
                            new GraphQLNonNull(
                                new GraphQLInputObjectType({
                                    name: `new${firstToUpperCase(pluralToSingular(tableName))}`,
                                    description:`Table row graphql type for table : ${tableName}`,
                                    fields:() => {
                                        let fields = {}
                                        tableDesc.forEach((tableDescObject) => {
                                            if(tableDescObject.Field !== 'id'){
                                                fields[tableDescObject.Field] = getColumnGraphQlType(tableDescObject.Type.toLowerCase(),tableDescObject.Null.toLowerCase()==='yes' ? true : false)
                                            }
                                        })
                                        return fields
                                    }
                                })
                            )
                        )
                    }
                }
                break;
            } 
            case 'update':{
                args = {
                    ['newValue']: {
                        type: new GraphQLNonNull(
                            new GraphQLInputObjectType({
                                name: `updated${firstToUpperCase(pluralToSingular(tableName))}`,
                                description:`Table row graphql type for table : ${tableName}`,
                                fields:() => {
                                    let fields = {}
                                    tableDesc.forEach((tableDescObject) => {
                                        if(tableDescObject.Field !== 'id'){
                                            fields[tableDescObject.Field] = getColumnGraphQlType(tableDescObject.Type.toLowerCase(),tableDescObject.Null.toLowerCase()==='yes' ? true : false)
                                        }
                                    })
                                    return fields
                                }
                            })
                        )
                    },
                    ...defaultArgs,
                    ...filtersArgs,
                    ...paginationArgs
                }
                break;
            }   
            case 'delete':{
                args = {
                    ...defaultArgs,
                    ...filtersArgs,
                    ...paginationArgs
                }
                break;
            }            
            default:{
                throw new TypeError('Error:Undefined argumentsForMethod type')
            }
                
        }
        
    }
    if(argumentsFor === 'query'){
        
        args = {
            ...defaultArgs,
            ...filtersArgs,
            ...paginationArgs
        }
        
    }

    return {
        ...args
    }

}

export default buildGraphQlArgs