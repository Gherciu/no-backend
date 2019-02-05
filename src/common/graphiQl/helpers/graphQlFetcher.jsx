import fetch from 'isomorphic-fetch'

const graphQLFetcher = (beforeFetch,afterFetch,onErrorFetch) => {
    return (graphQLParams)=> {
        beforeFetch(graphQLParams)
        return fetch(window.location.pathname, {
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