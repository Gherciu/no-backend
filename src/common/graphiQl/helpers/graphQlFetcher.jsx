import fetch from 'isomorphic-fetch'

const graphQLFetcher = (graphQLParams) => {
    return fetch(window.location.pathname, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(graphQLParams),
    }).then(response => response.json());
}

export default graphQLFetcher