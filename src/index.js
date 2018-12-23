const graphqlHTTP = require('express-graphql');
const noBackendDb = require('./db/index')

const noBackend = {

    db:(options)=>{

        const db = noBackendDb(Object.assign({},options))

        return graphqlHTTP({
            schema : db.getSchema(),
            rootValue : db.getRootValue(),
            graphiql : options.graphiql || false
        })

    }
    
}

module.exports = noBackend;