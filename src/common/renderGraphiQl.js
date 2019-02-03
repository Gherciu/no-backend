const remderGraphiQl = (options,req) => {

    return `<!DOCTYPE html>
        <html>
            <head>
                <title>no-backend</title>
                 <link rel="shortcut icon" type="image/png" href="https://static1.squarespace.com/static/56a7be419cadb699f13408dc/t/56a7da7b89a60a721010a7cd/favicon.ico"/>
                 <link rel="shortcut icon" type="image/png" href="https://static1.squarespace.com/static/56a7be419cadb699f13408dc/t/56a7da7b89a60a721010a7cd/favicon.ico"/>
            </head>
            <body>
                <div id="root">Loading...</div>
                <script src="${options.route}?getGraphiQlScript=true"></script>
            </body>
        </html>`

}

export default remderGraphiQl