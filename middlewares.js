const jwt = require("jsonwebtoken");
const checkearCredenciales = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(401)
      .send({ message: "no se recibieron las credenciales en esta consulta" });
  }
  next();
};

const verificarToken = (req, res, next) => {
  const token = req.header("Authorization").split("Bearer ")[1];
  if (!token) {
    throw {
      code: 401,
      message: "no se proporciono un token",
    };
  }
  const tokenValido = jwt.verify(token, "jfsijfdks");
  if (!tokenValido) throw { code: 401, message: "el token es invalido" };
  next();
};
module.exports = { checkearCredenciales, verificarToken };
