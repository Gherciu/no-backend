import React,{useRef} from 'react'
import GraphiQL from 'graphiql'
import { parse, print } from 'graphql'
import graphQLFetcher from './../helpers/graphQlFetcher.jsx'
import GraphiQlSearch from './GraphiQlSearch.jsx'
import GraphiQlSettings from './GraphiQlSettings.jsx'

import 'graphiql/graphiql.css'
import './GraphiQlTab.scss'

let fetcherOnTick = null
let ticks = 0
const GraphiQlTab = ()=>{

    let graphiqlEditorRef = useRef(null)

    const prettifySchema = (event) => {
        const editor = graphiqlEditorRef.getQueryEditor();
        const currentText = editor.getValue();
        const prettyText = print(parse(currentText));
        editor.setValue(prettyText);
    }

    const beforeFetch = (graphQlParams) => {
        const execButton = document.querySelector('.execute-button-wrap > .execute-button')
        //if click multiple times on exec restart timer
        clearInterval(fetcherOnTick)
        execButton.innerHTML = ''
        execButton.classList.remove('timmer-red')
        execButton.classList.remove('timmer-active')
        ticks = 0
        //start timer
        execButton.classList.add('timmer-active')
        fetcherOnTick = setInterval(() => {
         if(ticks<360){//0.36 sec
            ticks++
            execButton.innerHTML = ((ticks % 60000) / 1000).toFixed(2)
         }else{
            ticks++
            execButton.innerHTML = ((ticks % 60000) / 1000).toFixed(2)
            execButton.classList.add('timmer-red')
            if(ticks>3000){
                clearInterval(fetcherOnTick)
                setTimeout(()=>{
                    execButton.innerHTML = ''
                    execButton.classList.remove('timmer-red')
                    execButton.classList.remove('timmer-active')
                    ticks = 0
                },3000)
            }
         }
        },1)
    }

    const afterFetch = (response) => {
        const execButton = document.querySelector('.execute-button-wrap > .execute-button')
        clearInterval(fetcherOnTick)
        execButton.innerHTML = ''
        execButton.classList.remove('timmer-red')
        execButton.classList.remove('timmer-active')
        ticks = 0
    }

    const onErrorFetch = () => {
        const execButton = document.querySelector('.execute-button-wrap > .execute-button')
        execButton.innerHTML = ((ticks % 60000) / 1000).toFixed(2)
        clearInterval(fetcherOnTick)
        execButton.classList.add('timmer-red')
        setTimeout(()=>{
            execButton.innerHTML = ''
            execButton.classList.remove('timmer-red')
            execButton.classList.remove('timmer-active')
            ticks = 0
        },3000)
    }

    return(
        <div className='graphiql graphiql-tab'>
            <GraphiQL ref={ref =>graphiqlEditorRef = ref} fetcher={graphQLFetcher(beforeFetch,afterFetch,onErrorFetch)} editorTheme="dracula">
                <GraphiQL.Logo> <></> </GraphiQL.Logo>
                <GraphiQL.Toolbar>
                    <GraphiQL.Button
                        onClick={prettifySchema}
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