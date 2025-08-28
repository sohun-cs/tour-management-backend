import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

export const generateToken = (payload: JwtPayload, secret: Secret, option: string) => {

    const token = jwt.sign(payload, secret, { expiresIn: option } as SignOptions);

    return token;

}


export const verifyToken = (payload: string, secret: string) => {

    const token = jwt.verify(payload, secret);

    return token

}