import express from 'express'
import { importSchema } from 'graphql-import'

import verifyAccessToken from './middleware/verify-access-token'
import getUserFromDB from './middleware/get-user-from-db'

import createApolloServer from './apollo-server'
import { schemaDirectives } from './directives'
import * as resolvers from './resolvers'

import db from './db'

const { GRAPHQL_ENDPOINT, PORT, NODE_ENV } = process.env

const app = express()

app.post(
  GRAPHQL_ENDPOINT,
  // Verify and expose token information in req.user
  verifyAccessToken,
  // Handle auth error from previous middleware
  (err, req, res, next) => (err ? res.status(401).send(err.message) : next()),
  // Transform req.user to real DB user
  (req, res, next) => getUserFromDB(req, res, next, db)
)

const server = createApolloServer(app, {
  typeDefs: importSchema('src/schema/index.graphql'),
  resolvers,
  schemaDirectives,
  context: req => ({
    ...req,
    db,
  }),
})

server.listen({ port: PORT }, () => {
  console.log(
    `\n🚀 GraphQL Server is running on http://localhost:${PORT}${GRAPHQL_ENDPOINT} in "${NODE_ENV}" mode\n`
  )
})
