const renderGraphiql = (options,req) => {
    //url for requests with graphiql
    const urlForRequests = req.originalUrl.split(/\?/g)[0]
    // Current latest version of GraphiQL.
    const graphiqlVersion = '0.12.0';

    return `<!DOCTYPE html>
        <html>
            <head>
            <link href="https://cdn.jsdelivr.net/npm/graphiql@${graphiqlVersion}/graphiql.css" rel="stylesheet" />
            <script src="https://cdn.jsdelivr.net/es6-promise/4.0.5/es6-promise.auto.min.js"></script>
            <script src="https://cdn.jsdelivr.net/fetch/0.9.0/fetch.min.js"></script>
            <script src="https://cdn.jsdelivr.net/react/15.4.2/react.min.js"></script>
            <script src="https://cdn.jsdelivr.net/react/15.4.2/react-dom.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/graphiql@${graphiqlVersion}/graphiql.min.js"></script>
            <style>
                body {
                height: 100%;
                margin: 0;
                width: 100%;
                overflow: hidden;
                }
                #graphiql {
                    height: 100vh;
                }
                .topBar,.variable-editor-title{
                    background:#eaeaea !important;
                    border:none !important;
                }
                .toolbar-button{
                    outline:none !important;
                    border:none !important;
                    background:#c0c0c0 !important;
                    outline: 10px auto #c0c0c0 !important;
                    padding:6px 30px !important;
                    color:#fff !important;
                    font-weight:bold;
                }
                .title{
                    font-weight:bold;
                }
                .execute-button-wrap{
                    display:flex !important;
                    align-items:center !important;
                    justify-content:center !important;
                    width:40px !important;
                    height:32px !important;
                }
                .execute-button{
                    border:none !important;
                    background:#d0d0d0 !important;
                    box-shadow:none !important;
                    display:flex !important;
                    align-items:center !important;
                    justify-content:center !important;
                    width:40px !important;
                    height:32px !important;
                    border-radius:0% !important;
                    padding-right:10px;
                    border-radius:5px !important;
                }
                .execute-button > svg {
                    fill:#fff !important;
                }
                .docExplorerShow{
                    outline:none !important;
                    border:none !important;
                    background:#d0d0d0 !important;
                    outline: 0px auto #f0f0f0 !important;
                    padding:5px 30px !important;
                    color:#fff !important;
                    font-weight:bold;
                }
                .docExplorerShow::before{
                    border-color:#fff !important;
                }
                .CodeMirror-gutters , .CodeMirror-gutter.CodeMirror-foldgutter{
                    background:#eaeaea !important;
                    border:none !important;
                }
                .CodeMirror-scroll{
                    background:#fff !important;
                }
            </style>
            </head>
            <body>
            <div id="graphiql">Loading...</div>
            <script>
        
                // Parse the search string to get url parameters.
                var search = window.location.search;
                var parameters = {};
                search.substr(1).split('&').forEach(function (entry) {
                var eq = entry.indexOf('=');
                if (eq >= 0) {
                    parameters[decodeURIComponent(entry.slice(0, eq))] =
                    decodeURIComponent(entry.slice(eq + 1));
                }
                });
        
                // if variables was provided, try to format it.
                if (parameters.variables) {
                try {
                    parameters.variables =
                    JSON.stringify(JSON.parse(parameters.variables), null, 2);
                } catch (e) {
                    // Do nothing, we want to display the invalid JSON as a string, rather
                    // than present an error.
                }
                }
        
                // When the query and variables string is edited, update the URL bar so
                // that it can be easily shared
                function onEditQuery(newQuery) {
                parameters.query = newQuery;
                updateURL();
                }
        
                function onEditVariables(newVariables) {
                parameters.variables = newVariables;
                updateURL();
                }
        
                function onEditOperationName(newOperationName) {
                parameters.operationName = newOperationName;
                updateURL();
                }
        
                function updateURL() {
                var newSearch = '?' + Object.keys(parameters).filter(function (key) {
                    return Boolean(parameters[key]);
                }).map(function (key) {
                    return encodeURIComponent(key) + '=' +
                    encodeURIComponent(parameters[key]);
                }).join('&');
                history.replaceState(null, null, newSearch);
                }
        
                // Defines a GraphQL fetcher using the fetch API. You're not required to
                // use fetch, and could instead implement graphQLFetcher however you like,
                // as long as it returns a Promise or Observable.
                function graphQLFetcher(graphQLParams) {
                // This example expects a GraphQL server at the path /graphql.
                // Change this to point wherever you host your GraphQL server.
                return fetch('${urlForRequests}', {
                    method: 'post',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(graphQLParams),
                    credentials: 'include',
                }).then(function (response) {
                    return response.text();
                }).then(function (responseBody) {
                    try {
                    return JSON.parse(responseBody);
                    } catch (error) {
                    return responseBody;
                    }
                });
                }
        
                // Render <GraphiQL /> into the body.
                // See the README in the top level of this module to learn more about
                // how you can customize GraphiQL by providing different values or
                // additional child elements.
                ReactDOM.render(
                React.createElement(GraphiQL, {
                    fetcher: graphQLFetcher,
                    query: parameters.query,
                    variables: parameters.variables,
                    operationName: parameters.operationName,
                    onEditQuery: onEditQuery,
                    onEditVariables: onEditVariables,
                    onEditOperationName: onEditOperationName
                },React.createElement(GraphiQL.Logo,{},'no-backend')),
                document.getElementById('graphiql')
                );
            </script>
            </body>
        </html>`

}

export default renderGraphiql