import fetch from 'isomorphic-fetch'

const graphQLFetcher = (route,beforeFetch,afterFetch,onErrorFetch) => {
    return (graphQLParams)=> {
        beforeFetch(graphQLParams)
        return fetch(route, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(graphQLParams),
        }).then(response => {
            afterFetch(response)
           return response.json()
        }).catch((error)=>{
            onErrorFetch()
            return error
        })
    }
}

export default graphQLFetcher