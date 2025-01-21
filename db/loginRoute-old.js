module.exports = (req, res, next) => {
  console.log("Middleware - LOGIN - INIT..");

  console.log("Entrooo.1..req.method: " + req.method);
  console.log("Entrooo.1..req.url: " + req.url);
  //const users = require("./db/db_1.json");

  //console.log("db", req.app.db);
  //req.app.db.write({});
  if (
    req.method === "GET" &&
    req.url === "/auth/dfa/usuario-loguedo-habilitado"
  ) {
    const response = {
      valor: true,
    };
    console.log("req.url: " + req.url);
    res.json(response);
    next();
  } else {
    if (req.method === "POST" && req.url === "/auth/login-dfa") {
      console.log("Entrooo 1: POST - /login-dfa...");
      console.log(req.body);

      const { codigo } = req.body;

      if (codigo != "310279") {
        res.status(401).jsonp({
          tipo: "ERROR_APP_BUSINESS",
          ticket: "TK-156269",
          codigo: "CODIGO_INVALIDO",
          descripcion: "Codigo de verificación invalido.",
        });

        console.log(res.statusCode);
      } else {
        const response = {
          token:
            "ncvfjlkcovkelvkeivnfjkvevcfo.cmkdwocjoiwcmw.dnmiwedfiwejndfmwe",
          tokenRefresco:
            "2ncvfjlkcovkelvkeivnfjkvevcfo.cmkdwocjoiwcmw.dnmiwedfiwejndfmwe",
        };
        console.log("req.url: " + req.url);
        res.json(response);
        /* En la sección donde manejas la ruta "/auth/login-dfa" con el método POST, estás llamando a res.json(response) y luego a next(). En este caso, res.json() envía la respuesta al cliente, pero luego también estás pasando la solicitud al siguiente middleware con next(). Esto puede resultar en un conflicto, ya que la respuesta ya se ha enviado al cliente. */
        //next();
      }
    } else {
      if (req.method === "POST" && req.url === "/auth/login") {
        // Handle the login request here
        console.log("Entrooo 2: POST - /login...");

        console.log(req.body);

        const { usuario, clave } = req.body;

        if (
          usuario != "admin" ||
          (clave != "Prueba123" && clave != "Prueba3333")
        ) {
          res.status(401).jsonp({
            tipo: "ERROR_APP_BUSINESS",
            ticket: "TK-156269",
            codigo: "CODIGO_INVALIDO",
            descripcion: "Credenciales invalidas.",
          });

          console.log(res.statusCode);
        }

        // Perform authentication logic and return the desired response
        // You can retrieve the existing login resource from the db.json file if needed

        //var usuarios = req.app.db.get("usuarios");

        //console.log("usuarios: " + users.usuarios);

        //console.log("usuaLogin: " + usuaLogin);

        // Example response
        const response = {
          token:
            "ncvfjlkcovkelvkeivnfjkvevcfo.cmkdwocjoiwcmw.dnmiwedfiwejndfmwe",
          tokenRefresco:
            "2ncvfjlkcovkelvkeivnfjkvevcfo.cmkdwocjoiwcmw.dnmiwedfiwejndfmwe",
        };

        res.json(response);
      } else {
        let pattern = /\bcategoria/;
        let result = req.url.search(pattern);
        console.log("req.url:" + req.url + " - result:" + result);
        if ((req.method === "POST" || req.method === "PUT") && result > -1) {
          console.log("Entrooo 3: POST - /categoria...");
          const { camaraCodigo, descripcion } = req.body;
          console.log("Entrooo 3: camaraCodigo: " + camaraCodigo);
          if (
            camaraCodigo != "CAENA" &&
            camaraCodigo != "FAIM" &&
            camaraCodigo != "CAENA"
          ) {
            res.status(412).jsonp({
              tipo: "ERROR_APP_BUSINESS",
              ticket: "TK-156269",
              codigo: "CODIGO_INVALIDO",
              descripcion:
                "Valor de camaraCodigo (" + camaraCodigo + ") invalido.",
            });

            //console.log(res.statusCode);
          } else {
            next();
          }
        } else {
          if (req.method === "POST" && req.url === "/login") {
          }
          next();
        }
      }
    }
  }

  // Pass the request to the next middleware if it doesn't match the login route
};
