const remderGraphiQl = (options,req) => {

    return `<!DOCTYPE html>
        <html>
            <head>
                <title>no-backend</title>
            </head>
            <body>
                <div id="root">Loading...</div>
                <script>
                   window.__noBackend = ${JSON.stringify(global.__noBackend)}
                </script>
            </body>
        </html>`

}

export default remderGraphiQl