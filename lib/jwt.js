import jwt from "jsonwebtoken";


export function jwtSign(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }
);
}

export function verifyJwt(token) {
    return jwt.verify(token, process.env.JWT_SECRET)
}
