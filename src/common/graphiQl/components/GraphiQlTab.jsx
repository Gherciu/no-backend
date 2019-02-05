import React from 'react'
import GraphiQL from 'graphiql'
import graphQLFetcher from './../helpers/graphQlFetcher.jsx'
import GraphiQlSearch from './GraphiQlSearch.jsx'
import GraphiQlSettings from './GraphiQlSettings.jsx'

import 'graphiql/graphiql.css'
import './GraphiQlTab.scss'

const GraphiQlTab = ()=>{
    return(
        <div className='graphiql graphiql-tab'>
            <GraphiQL fetcher={graphQLFetcher} editorTheme="dracula">
                <GraphiQL.Logo> <></> </GraphiQL.Logo>
                <GraphiQL.Toolbar>
                    <GraphiQL.Button
                        onClick={()=>{}}
                        label="Prettify"
                    />
                    <GraphiQL.Button
                        onClick={()=>{}}
                        label="History"
                    />
                    <GraphiQlSearch />
                    <GraphiQL.Button
                        onClick={()=>{}}
                        label="Copy CURL"
                    />
                    <GraphiQlSettings />
                </GraphiQL.Toolbar>
            </GraphiQL>
        </div>
    )
}
export default GraphiQlTab