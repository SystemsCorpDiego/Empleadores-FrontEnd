//npx json-server db.json --middlewares ./loginRoute.js
const jsonServer = require("json-server");
const loginRoute = require("./loginRoute");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Add the login route
server.use(loginRoute);

// Use the default router for other routes
server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
