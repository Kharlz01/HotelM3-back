import { v4 } from 'uuid';

import { hashPassword, jwtEncode, verifyPassword} from '../services/auth.service.js'

// Con archivo index
import { 
    User,
} from '../database/models/index.js';

export async function createLogin(req,res){
    // Paso 1. Obtener los datos
    const {
        email,
        password,
    } = req.body;

    // Paso 2. Verificar los datos
    if (!email || !password) return res
        .status(401)
        .json({
            success: false,
            message: "Faltan datos por ingresar."
        });

    // Paso 3. Verificar que el correo exista
    const user = await User.findOne({
        where: {
            email,
        },
    });

    if (!user) return res
        .status(401)
        .json({
            success: false,
            message: "El usuario no existe."
        });

    // Paso 4. Verificar la contraseña
    const verifiedPassword = await verifyPassword(password,user.password);
    if (!verifiedPassword) return res
        .status(401)
        .json({
            success: false,
            message: "Credenciales incorrectas."
        });
    
    // Paso 5. Generar una token
    const now = new Date();

    const TWO_HS_IN = 60 * 60 * 2; // Dos horas de caducidad
    const expiresIn = Math.floor(now.getTime() / 1000) + TWO_HS_IN;
    const issuedAt = Math.floor(now.getTime() / 1000);

    // Claims = sub, exp, iat, iss
    const payload = {
        sub: user.id, // Sub es usuario
        exp: expiresIn, // Exp es el tiempo de expiracion.
        iat: now.getTime(), // iat es el tiempo de obtecion del token.
        iss: process.env.JWT_ISSUER, // iss es quien emitio el token (servidor).
    }

    // Se codifica el token
    const token = jwtEncode(payload);

    // Se elabora la respuesta
    return res
        .status(200)
        .json({
            success: true,
            data: {
                token,
                expiresIn: TWO_HS_IN,
            }
        });
}

export async function createSignup(req,res){
    // Recibir datos
    const {
        email,
        password,
        givenName,
        lastName,
    } = req.body;

    // Validar datos
    if (!email || !password || !givenName || !lastName) {
        return res
        .status(401)
        .json({
            success: false,
            message: 'Faltan campos requeridos.',
        });
    }

    // SELECT * FROM Users WHERE email = "..."
    const user = await User.findOne({
        where: {
            email,
        },
    });
    
    // Verificar que la clave sea mayor a 8 caracteres
    if (password.lenght < 8){
        return res
        .status(400)
        .json({
            success: false,
            message: 'La contraseña debe tener minimo 8 caracteres.'
        });
    }

    // Verificar si el usuario ya existe.
    if (user) {
        return res
            .status(400)
            .json({
                success: false,
                message: 'El usuario ya existe.'
            });
    }

    // Encriptar la clave.
    const passwordHash = await hashPassword(password); 

    const created = await User.create({
        id: v4(),
        email,
        password: passwordHash,
        givenName,
        lastName,
    });

    // En caso de que el usuario no se pueda crear.
    if (!created) return res
        .status(400)
        .json({
            success: false,
            message: 'El usuario no se pudo crear.'
        })

    // Creacion satisfactoria.
    res
        .status(201)
        .json({
            success: true,
            message: 'El usuario fue creado.'
        })
}