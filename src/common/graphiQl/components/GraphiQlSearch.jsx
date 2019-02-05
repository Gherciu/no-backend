import React from 'react'

import './GraphiQlSearch.scss'

const GraphiQlSearch = ()=>{
    return(
        <div className='graphiql-search'>
           <input type="text" placeholder="URL for request..." />
        </div>
    )
}
export default GraphiQlSearch