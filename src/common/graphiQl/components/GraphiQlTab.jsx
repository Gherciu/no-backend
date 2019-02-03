import React from 'react'
import GraphiQL from 'graphiql'
import graphQLFetcher from './../helpers/graphQlFetcher.jsx'

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
                        title="Prettify Query (Shift-Ctrl-P)"
                    />
                    <GraphiQL.Button
                        onClick={()=>{}}
                        label="History"
                    />
                    <input type="text" placeholder='Search query in history...' style={{width:'100%'}}/>
                    <GraphiQL.Button
                        onClick={()=>{}}
                        label="Settings"
                    />
                </GraphiQL.Toolbar>
            </GraphiQL>
        </div>
    )
}
export default GraphiQlTab