import { GraphQLString,GraphQLInt,GraphQLInputObjectType,GraphQLList,GraphQLNonNull } from 'graphql'
import getColumnGraphQlType from './getColumnGraphQlType'
import { pluralToSingular, firstToUpperCase } from './textHelpers'

const filtersArgs = {
    filters: { 
        type: new GraphQLList(
                 new GraphQLNonNull(
                    new GraphQLInputObjectType({
                        name:'filter',
                        fields:{
                            AND: { type: new GraphQLNonNull( new GraphQLList( new GraphQLNonNull(GraphQLString) ) ) },
                            OR: { type: new GraphQLList( new GraphQLNonNull(GraphQLString) ) },
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
    orderBy: { type:GraphQLString }
}
const buildGraphQlArgs = ( tableName,tableDesc,argumentsFor,argumentsForMethod ) => {
    
    let args = { }

    if(argumentsFor === 'mutation'){

        switch (argumentsForMethod) {
            case 'insert':{
                args = {
                    [tableName]: {
                        type: new GraphQLNonNull(
                            new GraphQLList(
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
                        )
                    }
                }
                break;
            } 
            case 'update':{
                args = {
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