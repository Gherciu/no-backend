import React,{useState,useContext} from 'react'
import {AppContext} from './App.jsx'

import './GraphiQlSearch.scss'

const GraphiQlSearch = ({activeTab})=>{
    const {state,dispatch} = useContext(AppContext)
    let [dropdownOpen,openDropdown] = useState(false)
    const closeDropdown = () => {//fix:on blur dont work the click on item
        setTimeout(()=>openDropdown(false),300)
    }
    return(
        <div className='graphiql-search'> 
           <input className={`${dropdownOpen?'active':''}`} onFocus={()=>openDropdown(true)} onBlur={()=>closeDropdown()} type="text" placeholder="URL for request..." onChange={()=>{}} value={activeTab.route || window.location.href}/>
           {dropdownOpen &&
                <div className="search-dropdown-container">
                    <div className="search-dropdown">
                    {window.__noBackend && window.__noBackend.middlewaresRoutes.map((item,index)=>
                        <div onClick={()=>dispatch({type:'CHANGE_TAB_ROUTE',payload:activeTab.id,value:`${window.location.origin}${item.route}`})} key={index} className={`search-dropdown-item ${window.location.origin+item.route===activeTab.route ?'active':''}`}>
                            {`${window.location.origin}${item.route}`}
                        </div>
                    )}
                    </div> 
                </div>
           }
        </div>
    )
}
export default GraphiQlSearch