const jsonServer = require("json-server");
const auth = require("json-server-auth");

const app = jsonServer.create();
const router = jsonServer.router("data/gestor.json");
const middlewares = jsonServer.defaults();

// IMPORTANT: bind the router to the app before auth
app.db = router.db;

app.use(middlewares);
app.use(auth);        // auth middleware must come before the router
app.use(router);

app.listen(5001, () => {
  console.log("JSON Server with Auth running on port 5001");
});