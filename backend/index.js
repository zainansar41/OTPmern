import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import connect from './database/conn.js'
import router from './routes/route.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.disable('x-powered-by')

const port = 8080

app.get('/', (req, res) => {
    res.send("Home Get request")
})
app.use('/api',router)


connect().then(() => {
    try {

        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`)
        })
    }
    catch (err) {
        console.log("connot connect")
    }
}).catch(error =>{
    console.log("invalid database connection")
})
