import { GraphQLScalarType,GraphQLObjectType,GraphQLNonNull,GraphQLList,GraphQLString } from 'graphql'

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

    const mutationsMethods = ['_upload_Files','_delete_Files']
    let filesMutationTypes = {}

    mutationsMethods.forEach((mutationMethod)=>{
        filesMutationTypes[mutationMethod] = {
            name:mutationMethod,
            description:mutationMethod.split('_').map((textPart)=>textPart.toLowerCase()).join(' '),
            type: new GraphQLNonNull( new GraphQLList( new GraphQLNonNull( fileOutputType ) ) ),
            args:{
                files: { type:new GraphQLNonNull( new GraphQLList( new GraphQLNonNull( mutationMethod==='_delete_Files'? GraphQLString : fileInputType ) ) ) }
            }
        }
    })

    return {
        filesMutationTypes
    }

}

export default buildFilesGraphQlMutations