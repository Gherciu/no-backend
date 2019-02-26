const tablesRulesReader = (tablesRules,req,action,tableName)=>{

    let isActionAllowed = true

    if(tablesRules && req){ 

        if(tableName && tablesRules[tableName]){//get rule from table tablesRules

            if(typeof tablesRules[tableName][action] === 'undefined'){
                isActionAllowed = true
            }else if(typeof tablesRules[tableName][action] === 'function'){
                isActionAllowed = tablesRules[tableName][action](req)
            }else{
                isActionAllowed = tablesRules[tableName][action]
            }
    
        }else{//get rule from global tablesRules
    
            if(typeof tablesRules[action] === 'undefined'){
                isActionAllowed = true
            }else if(typeof tablesRules[action] === 'function'){
                isActionAllowed = tablesRules[action](req)
            }else{
                isActionAllowed = tablesRules[action]
            }
    
        }

    }

    return isActionAllowed

}

export default tablesRulesReader