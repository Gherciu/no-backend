import {buildSchema} from 'graphql'

const buildTablesSchema = async (options,tables,db) => {
    let mutations = `
        type Mutation {
            setMessage(message: String): String
        }
    `
    let queryes = `
    type Query {
        hello: String
    }
`

    return buildSchema([queryes,mutations].join(' '))

}

export default buildTablesSchema