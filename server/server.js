const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { ApolloServer, gql } = require('apollo-server-express');
const fs = require('fs');
const path = require('path');
const expressGraphQL = require('express-graphql');

const typeDefs = fs.readFileSync(path.join(__dirname, '/schema.graphql'), { encoding: 'utf-8' });
const resolvers = require('./resolvers');


const port = 9000;
const jwtSecret = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

const app = express();

app.use(cors(), bodyParser.json(), expressJwt({
  secret: jwtSecret,
  credentialsRequired: false
}));

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.list().find((user) => user.email === email);
  if (!(user && user.password === password)) {
    res.sendStatus(401);
    return;
  }
  const token = jwt.sign({ sub: user.id }, jwtSecret);
  res.send({ token });
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {

    const token = req.headers.authorization.split(' ')[1];
    const { sub: id } = jwt.verify(token, jwtSecret);

    return { id };
  }
});

server.applyMiddleware({ app });

app.listen(port, () => console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`));
