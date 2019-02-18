import { GraphQLString,GraphQLInt,GraphQLInputObjectType,GraphQLList,GraphQLNonNull } from 'graphql'
import getColumnGraphQlType from './getColumnGraphQlType'
import { pluralToSingular, firstToUpperCase } from './textHelpers'

const filterArgs = {
    filter: { 
        type:
            new GraphQLList( 
                new GraphQLNonNull( 
                    new GraphQLInputObjectType({
                        name:'WHEREstatement',
                        fields:{
                            AND: { type: new GraphQLList( new GraphQLNonNull( GraphQLString ) ) },
                            OR: { type: new GraphQLList( new GraphQLNonNull( GraphQLString ) ) }
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
                    ...filterArgs,
                    ...paginationArgs
                }
                break;
            }   
            case 'delete':{
                args = {
                    ...defaultArgs,
                    ...filterArgs,
                    ...paginationArgs
                }
                break;
            }            
            default:{
                throw new TypeError('Error:Undefined argumentsForMethod')
            }
                
        }
        
    }
    if(argumentsFor === 'query'){
        
        args = {
            ...defaultArgs,
            ...filterArgs,
            ...paginationArgs
        }
        
    }

    return {
        ...args
    }

}

export default buildGraphQlArgs