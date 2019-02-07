import React,{useState,useContext,useEffect} from 'react'
import GraphiQL from 'graphiql'
import {AppContext} from './App.jsx'

import './GraphiQlHistory.scss'

const GraphiQlHistory = ({activeTab})=>{
    const {state,dispatch} = useContext(AppContext)
    let [dropdownOpen,openDropdown] = useState(false)   
    useEffect(()=>{
        const onClickOutsideDropdown = () => {
            if(dropdownOpen)
              openDropdown(false)
        }
        window.addEventListener('click',onClickOutsideDropdown)
        return () => {
            window.removeEventListener('click',onClickOutsideDropdown)
        }
    })
    const getQueryName = (query) => {
        return query.match(/\{\s*\w{1,}/ig)[0].match(/\w{1,}/ig)[0]
    }
    return(
        <div onClick={(e)=>{e.stopPropagation();openDropdown(!dropdownOpen)}} className='graphiql-history' >
            <GraphiQL.Button
                onClick={()=>{}}
                label="History"
            />
            {dropdownOpen &&
                <div className="dropdown-container">
                    {state.history.map((item,index)=>
                        <div className='item-container' key={item.id}>
                            <div className='item' onClick={()=>dispatch({type:'ADD_TAB',payload:{...item}})}>
                                {getQueryName(item.query)}
                                <span className='close-item' onClick={(e)=>{e.stopPropagation();dispatch({type:'REMOVE_ITEM_FROM_HISTORY',payload:item.id})}}></span>
                            </div>
                        </div>
                    )}
                    {state.history.length===0 &&
                      <div className="empty">No history!</div>
                    }
                </div> 
            }
        </div>
    )
}
export default GraphiQlHistory