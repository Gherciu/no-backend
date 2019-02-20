import { GraphQLScalarType,GraphQLObjectType,GraphQLNonNull,GraphQLList,GraphQLString } from 'graphql'
import { filesMutationsMethods } from './helpers/constants'

const fileOutputType = new GraphQLObjectType({
    name:'file',
    fields:{
        name: { type:new GraphQLNonNull( GraphQLString ) },
        fileType: { type:new GraphQLNonNull( GraphQLString ) },
        url: { type:new GraphQLNonNull( GraphQLString ) }
    }
})
const fileInputType = new GraphQLScalarType({
        name: 'newFile',
        description: 'The `newFile` scalar type represents a file upload.',
        parseValue: value => value,
        parseLiteral() {
            throw new Error('‘newFile’ scalar literal unsupported.')
        },
        serialize() {
            throw new Error('‘newFile’ scalar serialization unsupported.')
        }
  })

const buildFilesGraphQlMutations = ( options ) => {

    let filesMutationsTypes = {}

    filesMutationsMethods.forEach((mutationMethod)=>{
        filesMutationsTypes[mutationMethod] = {
            name:mutationMethod,
            description:mutationMethod.split('_').map((textPart)=>textPart.toLowerCase()).join(' '),
            type:  new GraphQLList( new GraphQLNonNull( fileOutputType ) ) ,
            args:{
                files: { type:new GraphQLList( new GraphQLNonNull( mutationMethod==='_delete_Files'? GraphQLString : fileInputType ) ) }
            }
        }
    })

    return {
        filesMutationsTypes
    }

}

export default buildFilesGraphQlMutations