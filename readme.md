# No-Backend

**Transform your database into working GraphQl schema**

### Usage 

```bash
npm i no-backend
```
your index.js (see more examples with diferent frameworks in folder examples)
```js
const express = require('express');
const noBackend = require('no-backend')
const app = express();

app.use(express.json());

noBackend({ 
    app:app,
    route:'/api',
    graphiql:true,
    connection:{
        driver:'mysql',
        host:'localhost',
        user:'root',
        password:'testpassword',
        database:'test'
    }
})

const port = process.env.port || 3000;
app.listen(port);
console.log(`Server started at port : ${port}`)
```
and open browser on ```http://localhost:YOUR-PORT```

#### If you like this repository star⭐ and watch👀 on  [GitHub](https://github.com/Gherciu/no-backend)

