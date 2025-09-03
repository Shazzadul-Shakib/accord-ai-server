import mongoose from 'mongoose'
import { Server } from 'http'
import config from './app/config'
import { app } from './app'

let server: Server

async function main() {
  try {
    await mongoose.connect(config.database_url as string)

    server = app.listen(config.port, () => {
      console.log(`Accord AI server is running on port ${config.port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

main()

//  ----- handle unhandledRejections & uncaughtExceptions ----- //
process.on('unhandledRejection', () => {
  console.log(`😈 unhandledRejection is detected , shutting down ...`)

  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`)
  process.exit(1)
})
