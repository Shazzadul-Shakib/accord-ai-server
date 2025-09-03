import express, { type Application } from 'express'
import cors from 'cors'

export const app: Application = express()

// --- parsers --- //
app.use(express.json())
app.use(cors())

// ----- root route ----- //
app.get('/', (_, res) => {
  res.send({ message: 'Accord AI server is running...' })
})
