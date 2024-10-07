// Paso 1. Construccion de un middleware.
// Nota: los middlewares tienen acceso a la solicitud (req), respuesta (req)

import { User, } from '../database/models/index.js';
import { jwtVerify } from "../services/auth.service.js";

// y a la llamada siguiente (next);
const admin = async (req, res, next) => {
  const authorization = req.headers['authorization']; // Bearer token

  if (!authorization) {
    return res
      .status(401)
      .json({
        success: false,
        message: 'Falta la cabecera de Autorization',
      });
  }

  // const token = authorization.split(' ')[1];
  const [ ,token, ] = authorization.split(' ');
  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        message: 'No se encontro el token',
      });
  }

  try {
    const payload = await jwtVerify(token);
    if (!payload) {
      return res
        .status(401)
        .json({
          success: false,
          message: 'El token es invalido',
        });
    }

    if ('success' in payload && !payload.success) {
      console.log(payload);
      return res
        .status(401)
        .json({
          success: false,
          data: payload,
        });
    }

    const { 
        id, 
        exp, 
        iss, 
        sub
    } = payload;

    // Verificación manual: expiración (exp), issuer (emitido por), 
    // subject (el identificar del usuario).
    // Validar que el token no haya expirado.

    // Validar que el token no haya expirado.
    const now = Math.floor(Date.now() / 1000); // Convertir a segundos
    if (exp <= now) {
      return res
        .status(401)
        .json({
          success: false,
          message: 'El token expiro/caduco',
        });
    }

    // Validar el emisor del token
    if (!iss || iss !== process.env.JWT_ISSUER) {
      return res
        .status(401)
        .json({
          success: false,
          message: 'El claim iss es invalido',
        });
    }

    // Validar el subject del token
    if (!sub) {
      return res
        .status(401)
        .json({
          success: false,
          message: 'El claim subject no esta presente en el cuerpo del token',
        });
    }

    const user = await User.findOne({ where: { id: sub } });
    if (!user?.isAdmin) {
      return res
        .status(403)
        .json({
          success: false,
          message: 'El usuario no tiene permisos para acceder'
        });
    }

    req.userId = sub;

    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        success: false,
        message: 'Error al procesar el token',
      });
  }
};

export default admin;