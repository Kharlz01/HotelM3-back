import { 
  hash, 
  genSalt, 
  compare,
} from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function hashPassword(plain) {
  const salt = await genSalt(16);
  const encrypt = await hash(plain, salt);
  return encrypt;
}

export async function verifyPassword(plain, hash) {
  const verified = await compare(plain, hash);
  return verified;
}

export function jwtEncode(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('No hay llave secreta');

  const token = jwt.sign(
    payload, 
    secret,
  );

  return token;
}

export async function jwtDecode(encoded) {}

export function jwtVerify(encoded) {
  try {
    const secret = process.env.JWT_SECRET;

    // Se verifica el token aqui
    const verified = jwt.verify(encoded, secret);
    return verified;
  } catch (err) {
    return null;
  }
}