const {
  agregarUsuarioBD,
  loginBD,
  obtenerDatosUsuarioLogueadoBD,
} = require("./consultasUsuarios");

const verificarParametros = (parametros) => {
  return parametros.every((parametro) => parametro != "");
};

const agregarUsuario = async (email, password, rol, lenguage) => {
  if (verificarParametros([email, password, rol, lenguage])) {
    try {
      await agregarUsuarioBD(email, password, rol, lenguage);
    } catch (error) {
      console.error(`Error al agregar usuario: ${error.message}`);
      return false;
    }
  } else {
    console.error("Error: faltan parámetros");
    return false;
  }
  return true;
};

const login = async (email, password) => {
  if (verificarParametros([email, password])) {
    try {
      const resultado = await loginBD(email, password);
      if (!resultado) {
        return false;
      }
    } catch (error) {
      console.error(`Error al iniciar sesión: ${error.message}`);
      return false;
    }
  } else {
    console.error("Error: faltan parámetros");
    return false;
  }
  return true;
};

const obtenerDatosUsuarioLogueado = async (email) => {
  try {
    const resultado = await obtenerDatosUsuarioLogueadoBD(email);
    if (!resultado) {
      return false;
    }
    return resultado;
  } catch (error) {
    console.error(`Error al obtener datos de usuario: ${error.message}`);
    return false;
  }
};
module.exports = { agregarUsuario, login, obtenerDatosUsuarioLogueado };
