const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "ha20030101",
  database: "softjobs",
  allowExitOnIdle: true,
});

const obtenerDatosUsuario = async (email) => {
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values);

  if (!rowCount) {
    throw {
      code: 404,
      message: "No se encontro ningun usuario con ese mail",
    };
  }

  delete usuario.password;
  return usuario;
};

const verificarCredenciales = async (email, password) => {
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $1";

  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values);
  const { password: passwordEncriptada } = usuario;

  const passwordCorrecta = bcrypt.compareSync(password, passwordEncriptada);
  if (!passwordCorrecta || !rowCount) {
    throw { code: 401, message: "Email o password incorrecta" };
  }
};

const registrarUsuario = async (usuario) => {
  let { email, password, rol, lenguage } = usuario;
  const passwordEncriptada = bcrypt.hashSync(password);

  const values = [email, passwordEncriptada, rol, lenguage];
  const consulta = "INSERT INTO usuarios values(DEFAULT, $1,$2,$3,$4)";
  await pool.query(consulta, values);
};
const reportarConsulta = async (req, res, next) => {
  const parametros = req.params;
  const url = req.url;
  console.log(`
    Hoy ${new Date()}
    Se ha recibido una consulta en la ruta ${url}
    `);
  next();
};

module.exports = {
  verificarCredenciales,
  obtenerDatosUsuario,
  registrarUsuario,
  reportarConsulta,
};
