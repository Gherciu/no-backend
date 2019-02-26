const renderGraphiQlStorm = (options,route) => {

    return `<!DOCTYPE html>
        <html>
            <head>
                <title>GraphiQl Storm</title>
            </head>
            <body>
                <script src='https://cdn.jsdelivr.net/npm/graphiql-storm@1.1.4/dist/index.js'></script>
                <script>
                    graphiQlStorm([{route:'${route}'}])
                </script>
            </body>
        </html>`

}

export default renderGraphiQlStorm