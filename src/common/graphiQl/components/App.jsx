import React,{Component} from 'react'
import GraphiQL from 'graphiql'
import graphQLFetcher from './../helpers/graphQlFetcher.jsx'

import './App.css'
import 'graphiql/graphiql.css'


const App = ()=>{
    return(
        <div className='graphiql'>
            <GraphiQL fetcher={graphQLFetcher}>
            {/* do stuff with graphiql */}
            </GraphiQL>
        </div>
    )
}
export default App