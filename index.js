const app = require('./app')

const port = process.env.Port || 3000


app.listen(port,() => {
    console.log(`Server is running on port ${port}`)
})