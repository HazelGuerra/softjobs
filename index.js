const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const {
  verificarCredenciales,
  obtenerDatosUsuario,
  registrarUsuario,
  reportarConsulta,
} = require("./consultas");
const { checkearCredenciales, verificarToken } = require("./middlewares");
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/usuarios", verificarToken, reportarConsulta, async (req, res) => {
  try {
    const token = req.header("Authorization").split("Bearer ")[1];
    const { email } = jwt.decode(token);
    const usuario = await obtenerDatosUsuario(email);
    res.json(usuario);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/login", checkearCredenciales, async (req, res) => {
  try {
    const { email, password } = req.body;
    await verificarCredenciales(email, password);
    const token = jwt.sign({ email }, "jfsijfdks");
    res.send(token);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/usuarios", async (req, res) => {
  try {
    const usuario = req.body;
    await registrarUsuario(usuario);
    res.send("usuario creado con exitos");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, console.log(`servidor encendido en puerto ${PORT}`));
