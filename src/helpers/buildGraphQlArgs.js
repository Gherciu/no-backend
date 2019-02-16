import { GraphQLString,GraphQLInt,GraphQLObjectType } from 'graphql'
import getColumnGraphQlType from './getColumnGraphQlType'

const buildGraphQlArgs = ( tableDesc,argumentsFor,argumentsForMethod ) => {

    let args = { }

    if(argumentsFor === 'mutation'){

        switch (argumentsForMethod) {
            case 'insert':{
                tableDesc.forEach((tableDescObject) => {
                    if(tableDescObject.Field !== 'id'){
                        args[tableDescObject.Field] = getColumnGraphQlType(tableDescObject.Type.toLowerCase(),tableDescObject.Null.toLowerCase()==='yes' ? true : false)
                    }
                })
                break;
            } 
            case 'update':{
                args['id'] = { type: GraphQLInt }
                break;
            }   
            case 'delete':{
                args['id'] = { type: GraphQLInt }
                break;
            }            
            default:{
                throw new TypeError('Error:Undefined argumentsForMethod')
            }
                
        }
        
    }
    if(argumentsFor === 'query'){
        
        args['id'] = { type: GraphQLInt }
        args['limit'] = { type: GraphQLInt }
        args['offset'] = { type: GraphQLInt }
        args['orderBy'] = { type: GraphQLString }
        
    }

    return {
        ...args
    }

}

export default buildGraphQlArgs