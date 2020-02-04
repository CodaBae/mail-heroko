require('express-async-errors')
const config = require('config')
const express = require('express')
const app = express()
const morgan = require('morgan')
const debug = require('debug')('app:startup')


require('./startup/routesApi')(app)
require('./startup/mongodb')()
//loading routes
// app.use(express.urlencoded({ extended: true }))
if (app.get('env') === 'development') {
    debug('morgan enabled')
    app.use(morgan('tiny'))
}
// creating environment variable
let port = process.env.PORT || 4000
app.listen(port, () => console.log(`you app is listening at ${port}`))
