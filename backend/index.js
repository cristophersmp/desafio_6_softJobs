const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { api_secret, api_token_expired_time } = require("./config");

const {
  agregarUsuario,
  login,
  obtenerDatosUsuarioLogueado,
} = require("./modules/controladorUsuarios");

const app = express();
app.listen(3000, console.log("Servidor corriendo :)"));

app.use(cors());
app.use(express.json());

app.post("/usuarios", async (req, res) => {
  const { email, password, rol, lenguage } = req.body;
  try {
    const resultado = await agregarUsuario(email, password, rol, lenguage);
    if (resultado) {
      res.status(200).send("Usuario agregado bkn");
    } else {
      res.status(500).send("Ocurrió un error al agregar usuario");
    }
  } catch (error) {
    res
      .status(500)
      .send(`Ocurrió un error al agregar usuario: ${error.message}`);
  }
});

app.post(
  "/login",
  (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send("Faltan credenciales de inicio de sesión");
    } else {
      next();
    }
  },
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const resultado = await login(email, password);
      if (resultado) {
        const token = jwt.sign({ email }, api_secret, {
          expiresIn: api_token_expired_time,
        });
        res.send(token);
      } else {
        res.status(500).send("Ocurrió un error al iniciar sesión");
      }
    } catch (error) {
      res
        .status(500)
        .send(`Ocurrió un error al iniciar sesión: ${error.message}`);
    }
  }
);

app.get(
  "/usuarios",
  (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      res.status(401).send("Token de autorización no válido");
    } else {
      const token = authorizationHeader.split("Bearer ")[1];
      try {
        jwt.verify(token, api_secret);
        next();
      } catch (error) {
        res.status(401).send("Token de autorización inválido");
      }
    }
  },
  async (req, res) => {
    try {
      const Authorization = req.header("Authorization");
      const token = Authorization.split("Bearer ")[1];
      jwt.verify(token, api_secret);
      const { email } = jwt.decode(token);
      const resultado = await obtenerDatosUsuarioLogueado(email);
      if (resultado) {
        res.json(resultado[0]);
      } else {
        res.status(500).send("Ocurrió un error al obtener datos de usuario");
      }
    } catch (error) {
      res
        .status(500)
        .send(`Ocurrió un error al obtener datos de usuario: ${error.message}`);
    }
  }
);
