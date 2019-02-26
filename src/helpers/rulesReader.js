const rulesReader = (rules,req,action,tableName)=>{

    let isActionAllowed = true

    if(rules && req){ 

        if(tableName && rules[tableName]){//get rule from table rules

            if(typeof rules[tableName][action] === 'undefined'){
                isActionAllowed = true
            }else if(typeof rules[tableName][action] === 'function'){
                isActionAllowed = rules[tableName][action](req)
            }else{
                isActionAllowed = rules[tableName][action]
            }
    
        }else{//get rule from global rules
    
            if(typeof rules[action] === 'undefined'){
                isActionAllowed = true
            }else if(typeof rules[action] === 'function'){
                isActionAllowed = rules[action](req)
            }else{
                isActionAllowed = rules[action]
            }
    
        }

    }

    return isActionAllowed

}

export default rulesReader