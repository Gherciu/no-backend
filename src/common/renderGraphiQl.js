const remderGraphiQl = (options,req) => {

    return `<!DOCTYPE html>
        <html>
            <head>
                <title>no-backend</title>
                 <link rel="icon" sizes="any" type="image/png" href="https://github.com/Gherciu/moldstarter/blob/master/app/img/favicon/apple-touch-icon-180x180.png?raw=true"/>
            </head>
            <body>
                <div id="root">Loading...</div>
                <script>
                   window.__noBackend = ${JSON.stringify(global.__noBackend)}
                </script>
                <script src="${options.route}?getGraphiQlScript=true"></script>
            </body>
        </html>`

}

export default remderGraphiQl