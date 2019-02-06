import React,{useReducer,useEffect} from 'react'
import GraphiQlTab from './GraphiQlTab.jsx'
import registerLocalStorageNoBackendValues from './../helpers/registerLocalStorageNoBackendValues.jsx'
import GraphiQlTabsBar from './GraphiQlTabsBar.jsx'

const defaultTabValues = {active:true}
const initialState = {
    tabs:  []
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_INITIAL_STATE':{
            let newState = action.payload
            registerLocalStorageNoBackendValues(newState)
            return newState
        }
        case 'ADD_TAB':{
            let newStateTabs = [...state.tabs]
            newStateTabs = newStateTabs.map((item,index)=>{
                if(item.active){
                    return {...item,active:false}
                }
                return item
            })
            let newState = {...state,tabs:[...newStateTabs,{id:new Date().getTime(),...defaultTabValues}]}
            registerLocalStorageNoBackendValues(newState)
            return newState
        }
        case 'REMOVE_TAB':{
            let newStateTabs = [...state.tabs]
            if(newStateTabs.length>1){
                newStateTabs = newStateTabs.filter((item,index)=>{
                    return item.id !== action.payload
                })
            }
            if(newStateTabs.filter((item,index)=>item.active).length < 1){
             newStateTabs = newStateTabs.map((item,index)=>{
                 if(index === newStateTabs.length-1){
                     return {...item,active:true}
                 }
                 return item
             })
            }
            let newState = {...state,tabs:[...newStateTabs]}
            registerLocalStorageNoBackendValues(newState)
            return newState
        }
        case 'ACTIVATE_TAB':{
            let newStateTabs = [...state.tabs]
            newStateTabs = newStateTabs.map((item,index)=>{
                if(item.id === action.payload){
                    return {...item,active:true}
                }else{
                    return {...item,active:false}
                }
            })
            let newState = {...state,tabs:[...newStateTabs]}
            registerLocalStorageNoBackendValues(newState)
            return newState
        }
        case 'CHANGE_TAB_TITLE':{
            let newStateTabs = [...state.tabs]
            newStateTabs = newStateTabs.map((item,index)=>{
                if(item.id === action.payload){
                    return {...item,title:action.title}
                }
                return item
            })
            let newState = {...state,tabs:[...newStateTabs]}
            registerLocalStorageNoBackendValues(newState)
            return newState
        }
        case 'CHANGE_TAB_STORAGE':{
            let newStateTabs = [...state.tabs]
            newStateTabs = newStateTabs.map((item,index)=>{
                if(item.id === action.payload){
                    return {...item,...action.value}
                }
                return item
            })
            let newState = {...state,tabs:[...newStateTabs]}
            registerLocalStorageNoBackendValues(newState)
            return newState
        }
        case 'CHANGE_TAB_QUERY':{
            let newStateTabs = [...state.tabs]
            newStateTabs = newStateTabs.map((item,index)=>{
                if(item.id === action.payload){
                    return {...item,query:action.value}
                }
                return item
            })
            let newState = {...state,tabs:[...newStateTabs]}
            registerLocalStorageNoBackendValues(newState)
            return newState
        }
        case 'CHANGE_TAB_RESPONSE':{
            let newStateTabs = [...state.tabs]
            newStateTabs = newStateTabs.map((item,index)=>{
                if(item.id === action.payload){
                    return {...item,response:action.value}
                }
                return item
            })
            let newState = {...state,tabs:[...newStateTabs]}
            registerLocalStorageNoBackendValues(newState)
            return newState
        }
        default:
            return state
    }
}

export const AppContext = React.createContext()
const App = ()=>{
    const [state,dispatch] = useReducer(reducer,initialState)
    useEffect(()=>{
        if(localStorage.getItem('__noBackend')){
           dispatch({type:'SET_INITIAL_STATE',payload:JSON.parse(localStorage.getItem('__noBackend'))})
        }else{
           dispatch({type:'SET_INITIAL_STATE',payload:{...initialState,tabs:[{id:new Date().getTime(),...defaultTabValues}]}})
        }
    },[])
    const activeTab = state.tabs.length>0 ? state.tabs.filter((item)=>item.active)[0] :null
    return(
        <>
            <AppContext.Provider value={{state,dispatch}}>
                <GraphiQlTabsBar />
                {activeTab &&
                    <GraphiQlTab activeTab={activeTab} />
                }
            </AppContext.Provider>
        </>
    )
}
export default App