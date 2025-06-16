import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import express from 'express'
import { apiReference } from '@scalar/express-api-reference'
import openapi from './swagger.js'

dotenv.config()

const app = express()
const __dirname = path.dirname(new URL(import.meta.url).pathname)
app.get('/openapi.json', (req, res) => {
  if (process.env.DEVELOPMENT_MODE) {
    return res.json(openapi)
  }
  res.sendFile(path.join(__dirname, '../dist/openapi-min.json'))
})

app.use(
  '/swagger',
  apiReference({
    url: './openapi.json'
  }),
)

app.get('/', (req, res) => {
  res.redirect('/swagger')
})

app.listen(3000)