import React from 'react'

import './GraphiQlTabsBar.scss'

const GraphiQlTabsBar = ()=>{
    const items = [{active:true},{active:false}]
    return(
        <div className='graphiql-tabs-bar'>
           {items.map((item,index)=>
            <div key={index} className="graphiql-tab-item">
                <div className={`graphiql-tab-item-content ${item.active?'active':''}`}>
                    {item.active ?
                        <input className="graphiql-tab-item-title" type="text" onChange={()=>{}} placeholder={item.title || 'New tab'} value={item.title || 'New tab'} />
                        :
                        <div className="graphiql-tab-item-title">{item.title || 'New tab'}</div>
                    }
                    <div className="graphiql-tab-item-close"></div>
                </div>
                {items.length === (index+1) && <div className="graphiql-tab-item-add">+</div>}
            </div>
           )}
        </div>
    )
}
export default GraphiQlTabsBar