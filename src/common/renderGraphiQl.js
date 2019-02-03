const remderGraphiQl = (options,req) => {

    return `<!DOCTYPE html>
        <html>
            <head>
              <title>no-backend</title>
            </head>
            <body>
                <div id="graphiql">Loading...</div>
                <script src="${options.route}?getGraphiQlScript=true"></script>
            </body>
        </html>`

}

export default remderGraphiQl