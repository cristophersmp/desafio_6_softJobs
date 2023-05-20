const pool = require("./conexion");
const bcrypt = require("bcrypt");
const saltRounds = 10;

//1. Registrar y obtener usuarios de la base de datos
const agregarUsuarioBD = async (email, password, rol, lenguage) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const consulta = "INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)";
  const values = [email, hashedPassword, rol, lenguage];
  try {
    await pool.query(consulta, values);
  } catch (error) {
    console.error(
      `Error al agregar usuario a la base de datos: ${error.message}`
    );
    return false;
  }
  console.log(`Usuario ${email} agregado con exito a la base de datos`);
  return true;
};

const loginBD = async (email, password) => {
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const values = [email];
  try {
    const { rows } = await pool.query(consulta, values);
    console.log(rows);
    if (!rows.length) {
      console.error("Error: usuario no encontrado");
      return false;
    }
    const hashedPassword = rows[0].password;
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      console.error("Error: contraseña incorrecta");
      return false;
    }
  } catch (error) {
    console.error(`Error al iniciar sesión: ${error.message}`);
    return false;
  }
  console.log(`Usuario ${email} logueado`);
  return true;
};

const obtenerDatosUsuarioLogueadoBD = async (email) => {
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const values = [email];
  try {
    const { rows } = await pool.query(consulta, values);
    if (!rows.length) {
      console.error("Error: usuario no encontrado");
      return false;
    }
    console.log(rows);
    return rows;
  } catch (error) {
    console.error(`Error al obtener datos de usuario: ${error.message}`);
    return false;
  }
};

module.exports = { agregarUsuarioBD, loginBD, obtenerDatosUsuarioLogueadoBD };
