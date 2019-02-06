import React,{useState} from 'react'

import './GraphiQlSearch.scss'

const GraphiQlSearch = ({activeTab})=>{
    let [dropdownOpen,openDropdown] = useState(false)
    console.log(window.__noBackend)
    return(
        <div className='graphiql-search'> 
           <input className={`${dropdownOpen?'active':''}`} onFocus={()=>openDropdown(true)} onBlur={()=>openDropdown(false)} type="text" placeholder="URL for request..." onChange={()=>{}} value={activeTab.route || window.location.href}/>
           {dropdownOpen &&
                <div className="search-dropdown-container">
                    <div className="search-dropdown">
                        <div className="search-dropdown-item">
                            http://adsdsadsa.com/db
                        </div>
                    </div> 
                </div>
           }
        </div>
    )
}
export default GraphiQlSearch