import { jwtVerify } from "../services/auth.service.js";

export async function auth(req, res, next){
    // Authorization: Bearer *token*
    // Result: ['Bearer', *token*]
    const authorization = req.headers.authorization;
    if (!authorization) return res
        .status(401)
        .json({
            success: false,
            message: 'No hay cabecera de autorizacion.'
        });

    const fragments = authorization.split(' ');
    const [tokenType, token] = fragments;

    // Se verifica tipo de token
    if (tokenType !== 'Bearer') return res
        .status(401)
        .json({
            success: false,
            message: 'Tipo de token invalido.'
        });
    
    // Se verifica el token directamente
    if (!token) return res
        .status(403)
        .json({
            success: false,
            message: 'No hay token.'
        });

    // Se valida el token
    const verified = jwtVerify(token);
    if (!verified) return res
        .status(403)
        .json({
            success: false,
            message: "Token invalido."
        });

    // Finalmente asignamos el id del usuario a la request
    req.userId = verified.sub;

    next();
}