import jwt from "jsonwebtoken"


export default function generarToken(user){
    const SECRET = "192is9mun2s982h18j1"
    const token= jwt.sign({ user: user._id,nombre:user.user }, SECRET , {
        expiresIn: '24h'
    });

    return token
}