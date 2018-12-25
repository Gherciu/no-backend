const express = require('express');
const NoBackend = require('./../../dist/index')
const tablesSchema = require('./tablesSchema')

console.log(new NoBackend())
// const NoBackendDbMiddleware = NoBackend.db({
// //     tablesSchema,
// //     graphiql:true
// // })
// // const NoBackendFilesMiddleware = NoBackend.files({

// // })
// // const NoBackendAuthMiddleware = NoBackend.auth({

// })
const app = express();
const port = process.env.port || 2626;

// app.use('/db',NoBackendDbMiddleware);
// app.use('/files',NoBackendFilesMiddleware);
// app.use('/auth',NoBackendAuthMiddleware);

app.listen(port);
console.log(`Server started at port : ${port}`)
