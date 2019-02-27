import { rules } from './constants';

const rulesReader = (optionsRules,action,tableName,req)=>{

    let isActionAllowed = true

    if(optionsRules && optionsRules[action] && action === rules['exclude']){//_exculde

        if(Array.isArray(optionsRules[action])){
            if(tableName){
                isActionAllowed = optionsRules[action].filter((tableNameItem)=>tableName===tableNameItem).length > 0 ? false : true
            }else{
                throw new Error('Error: tableName argument is required on rulesReader!');
            }
        }else{
            throw new Error('Error: rule _exclude must be array, on rulesReader!');
        }

    }
    if(optionsRules && req){//_read,_insert,_update,_delete

        if(tableName && optionsRules[tableName]){//get rule from table rules

            if(typeof optionsRules[tableName][action] === 'undefined'){
                isActionAllowed = true
            }else if(typeof optionsRules[tableName][action] === 'function'){
                isActionAllowed = optionsRules[tableName][action](req)
            }else{
                isActionAllowed = optionsRules[tableName][action]
            }
    
        }else{//get rule from global rules
    
            if(typeof optionsRules[action] === 'undefined'){
                isActionAllowed = true
            }else if(typeof optionsRules[action] === 'function'){
                isActionAllowed = optionsRules[action](req)
            }else{
                isActionAllowed = optionsRules[action]
            }
    
        }

    }

    return isActionAllowed

}

export default rulesReader